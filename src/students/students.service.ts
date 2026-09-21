import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AttendanceStatus, EntityStatus, HomeworkStatus } from '../common/enums';
import { ExamResult } from '../exams/exam-result.entity';
import { LessonAttendance } from '../lessons/lesson-attendance.entity';
import { Lesson } from '../lessons/lesson.entity';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { Student } from './student.entity';

const HW_SCORE: Record<string, number> = {
  [HomeworkStatus.FULL]: 100,
  [HomeworkStatus.PARTIAL]: 40,
  [HomeworkStatus.NONE]: 0,
};

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private repo: Repository<Student>,
    @InjectRepository(Lesson) private lessons: Repository<Lesson>,
    @InjectRepository(LessonAttendance)
    private attendances: Repository<LessonAttendance>,
    @InjectRepository(ExamResult) private examResults: Repository<ExamResult>,
  ) {}

  async findAll(groupId?: string, month?: string) {
    const where = groupId ? { groupId } : {};
    const students = await this.repo.find({ where, order: { name: 'ASC' } });
    return this.withComputedRates(students, month);
  }

  async findOne(id: string, month?: string) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Talaba topilmadi');
    const [withRates] = await this.withComputedRates([student], month);
    return withRates;
  }

  create(dto: CreateStudentDto) {
    const student = this.repo.create({
      id: `st${Date.now()}`,
      name: dto.name,
      phone: dto.phone,
      parentPhone: dto.parentPhone,
      groupId: dto.groupId || undefined,
      status: dto.status ?? EntityStatus.ACTIVE,
      joinedAt: dto.joinedAt || new Date().toISOString().slice(0, 10),
      rewardEarned: 0,
      rewardSpent: 0,
      attendanceRate: 0,
      homeworkRate: 0,
      examAvg: 0,
    });
    return this.repo.save(student);
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Talaba topilmadi');
    const { groupId, ...rest } = dto;
    Object.assign(student, rest);
    if (groupId !== undefined) {
      student.groupId = groupId || undefined;
    }
    const saved = await this.repo.save(student);
    const [withRates] = await this.withComputedRates([saved]);
    return withRates;
  }

  async remove(id: string) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Talaba topilmadi');
    await this.repo.remove(student);
    return { deleted: true };
  }

  async addReward(id: string, amount: number) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Talaba topilmadi');
    student.rewardEarned += amount;
    return this.repo.save(student);
  }

  async spendReward(id: string, amount: number) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Talaba topilmadi');
    const balance = student.rewardEarned - student.rewardSpent;
    if (amount > balance) {
      throw new BadRequestException('Mukofot balansi yetarli emas');
    }
    student.rewardSpent += amount;
    return this.repo.save(student);
  }

  /** Davomat/vazifa — tanlangan oy darslaridan; imtihon o'rtachasi — barcha natijalar. */
  private async withComputedRates(students: Student[], month?: string) {
    if (students.length === 0) return students;

    const prefix = resolveMonth(month);
    const ids = students.map((s) => s.id);

    const [allLessons, results] = await Promise.all([
      this.lessons.find(),
      this.examResults.find({ where: { studentId: In(ids) } }),
    ]);
    const monthLessons = allLessons.filter((l) =>
      lessonYearMonth(l.date) === prefix,
    );

    const examSum = new Map<string, { total: number; count: number }>();
    for (const row of results) {
      const cur = examSum.get(row.studentId) ?? { total: 0, count: 0 };
      cur.total += row.score;
      cur.count += 1;
      examSum.set(row.studentId, cur);
    }

    const rowsByStudent = new Map<string, LessonAttendance[]>();
    if (monthLessons.length > 0) {
      const lessonIds = monthLessons.map((l) => l.id);
      const rows = await this.attendances.find({
        where: { lessonId: In(lessonIds), studentId: In(ids) },
      });
      for (const row of rows) {
        const list = rowsByStudent.get(row.studentId) ?? [];
        list.push(row);
        rowsByStudent.set(row.studentId, list);
      }
    }

    return students.map((student) => {
      const exam = examSum.get(student.id);
      const { attendanceRate, homeworkRate } = ratesFromRows(
        rowsByStudent.get(student.id) ?? [],
      );
      return {
        ...student,
        attendanceRate,
        homeworkRate,
        examAvg: exam ? Math.round(exam.total / exam.count) : 0,
      };
    });
  }
}

function lessonYearMonth(date: string | Date | undefined): string {
  if (!date) return '';
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  return String(date).slice(0, 7);
}

function resolveMonth(input?: string): string {
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  if (!input?.trim()) return current;
  const value = input.trim();
  if (/^\d{4}-\d{2}$/.test(value)) return value;
  if (/^\d{1,2}$/.test(value)) {
    const n = Number(value);
    if (n >= 1 && n <= 12) return `${now.getFullYear()}-${String(n).padStart(2, '0')}`;
  }
  return current;
}

function ratesFromRows(rows: LessonAttendance[]) {
  if (rows.length === 0) return { attendanceRate: 0, homeworkRate: 0 };

  const present = rows.filter((r) => r.attendance === AttendanceStatus.PRESENT);
  const attendanceRate = Math.round((present.length / rows.length) * 100);
  const homeworkRate =
    present.length === 0
      ? 0
      : Math.round(
          present.reduce((sum, r) => sum + (HW_SCORE[r.homework] ?? 0), 0) /
            present.length,
        );

  return { attendanceRate, homeworkRate };
}

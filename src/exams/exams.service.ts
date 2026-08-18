import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamStatus } from '../common/enums';
import { calcExamReward } from '../common/rewards';
import { StudentsService } from '../students/students.service';
import {
  CreateExamDto,
  SubmitExamResultsDto,
  UpdateExamDto,
} from './dto/exam.dto';
import { ExamResult } from './exam-result.entity';
import { Exam } from './exam.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam) private exams: Repository<Exam>,
    @InjectRepository(ExamResult) private results: Repository<ExamResult>,
    private studentsService: StudentsService,
  ) {}

  async findAll(filters?: { groupId?: string; teacherId?: string }) {
    const where: Record<string, string> = {};
    if (filters?.groupId) where.groupId = filters.groupId;
    if (filters?.teacherId) where.teacherId = filters.teacherId;
    const list = await this.exams.find({ where, order: { date: 'DESC' } });
    return Promise.all(list.map((e) => this.withResults(e)));
  }

  async findOne(id: string) {
    const exam = await this.exams.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Imtihon topilmadi');
    return this.withResults(exam);
  }

  private async withResults(exam: Exam) {
    const results = await this.results.find({ where: { examId: exam.id } });
    return { ...exam, results };
  }

  create(dto: CreateExamDto, teacherId: string) {
    const exam = this.exams.create({
      id: `ex${Date.now()}`,
      name: dto.name,
      subjectId: dto.subjectId,
      groupId: dto.groupId,
      teacherId: dto.teacherId ?? teacherId,
      date: dto.date,
      maxScore: dto.maxScore ?? 100,
      status: ExamStatus.UPCOMING,
    });
    return this.exams.save(exam);
  }

  async update(id: string, dto: UpdateExamDto) {
    const exam = await this.exams.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Imtihon topilmadi');
    Object.assign(exam, dto);
    return this.exams.save(exam);
  }

  async submitResults(id: string, dto: SubmitExamResultsDto) {
    const exam = await this.exams.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Imtihon topilmadi');
    if (exam.status === ExamStatus.COMPLETED) {
      throw new BadRequestException('Natijalar allaqachon saqlangan');
    }

    const savedResults: ExamResult[] = [];
    for (const row of dto.results) {
      const reward = calcExamReward(row.score);
      const result = await this.results.save(
        this.results.create({
          id: `er${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
          examId: id,
          studentId: row.studentId,
          score: row.score,
          reward,
        }),
      );
      savedResults.push(result);
      if (reward > 0) {
        await this.studentsService.addReward(row.studentId, reward);
      }
    }

    exam.status = ExamStatus.COMPLETED;
    await this.exams.save(exam);
    return { ...exam, results: savedResults };
  }

  async remove(id: string) {
    const exam = await this.exams.findOne({ where: { id } });
    if (!exam) throw new NotFoundException('Imtihon topilmadi');
    await this.results.delete({ examId: id });
    await this.exams.remove(exam);
    return { deleted: true };
  }
}

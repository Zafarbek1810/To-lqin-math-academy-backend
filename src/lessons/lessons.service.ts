import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LESSON_LOCK_HOURS, calcLessonReward } from '../common/rewards';
import { GroupsService } from '../groups/groups.service';
import { StudentsService } from '../students/students.service';
import { User } from '../users/user.entity';
import { Role } from '../common/enums';
import { SaveLessonDto } from './dto/lesson.dto';
import { LessonAttendance } from './lesson-attendance.entity';
import { Lesson } from './lesson.entity';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessons: Repository<Lesson>,
    @InjectRepository(LessonAttendance)
    private attendances: Repository<LessonAttendance>,
    private groupsService: GroupsService,
    private studentsService: StudentsService,
  ) {}

  async findAll(filters?: { groupId?: string; teacherId?: string }) {
    const where: Record<string, string> = {};
    if (filters?.groupId) where.groupId = filters.groupId;
    if (filters?.teacherId) where.teacherId = filters.teacherId;

    const list = await this.lessons.find({
      where,
      order: { date: 'DESC' },
    });

    return Promise.all(
      list.map(async (lesson) => ({
        ...lesson,
        attendances: await this.attendances.find({
          where: { lessonId: lesson.id },
        }),
      })),
    );
  }

  async findOne(id: string) {
    const lesson = await this.lessons.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('Dars topilmadi');
    const attendances = await this.attendances.find({
      where: { lessonId: id },
    });
    return { ...lesson, attendances };
  }

  async saveLesson(dto: SaveLessonDto, user: User) {
    const group = await this.groupsService.findOne(dto.groupId);

    if (group.lessonLocked) {
      throw new BadRequestException(
        'Guruh 24 soat davomida yopiq. Keyinroq urinib ko\'ring.',
      );
    }

    if (user.role === Role.TEACHER && group.teacherId !== user.id) {
      throw new ForbiddenException('Bu guruh sizga tegishli emas');
    }

    const teacherId =
      user.role === Role.TEACHER ? user.id : group.teacherId;
    const date = dto.date ?? new Date().toISOString().slice(0, 10);
    const lessonId = `l${Date.now()}`;

    const lesson = await this.lessons.save(
      this.lessons.create({
        id: lessonId,
        groupId: dto.groupId,
        teacherId,
        date,
        saved: true,
      }),
    );

    const rows: LessonAttendance[] = [];
    for (const row of dto.attendances) {
      const rewards = calcLessonReward(row.attendance, row.homework);
      const attendance = await this.attendances.save(
        this.attendances.create({
          id: `la${Date.now()}${Math.random().toString(36).slice(2, 7)}`,
          lessonId,
          studentId: row.studentId,
          attendance: row.attendance,
          homework: row.homework,
          attendanceReward: rewards.attendanceReward,
          homeworkReward: rewards.homeworkReward,
        }),
      );
      rows.push(attendance);

      if (rewards.total > 0) {
        await this.studentsService.addReward(row.studentId, rewards.total);
      }
    }

    await this.groupsService.lockGroup(dto.groupId, LESSON_LOCK_HOURS);

    return { ...lesson, attendances: rows };
  }
}

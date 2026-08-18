import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { AttendanceStatus, HomeworkStatus } from '../common/enums';

@Entity('lesson_attendances')
export class LessonAttendance {
  @PrimaryColumn()
  id: string;

  @Column()
  lessonId: string;

  @Column()
  studentId: string;

  @Column({ type: 'text' })
  attendance: AttendanceStatus;

  @Column({ type: 'text' })
  homework: HomeworkStatus;

  @Column({ type: 'integer', default: 0 })
  attendanceReward: number;

  @Column({ type: 'integer', default: 0 })
  homeworkReward: number;

  @CreateDateColumn()
  createdAt: Date;
}

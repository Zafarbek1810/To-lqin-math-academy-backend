import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExamStatus } from '../common/enums';

@Entity('exams')
export class Exam {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  subjectId: string;

  @Column()
  groupId: string;

  @Column()
  teacherId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'integer', default: 100 })
  maxScore: number;

  @Column({ type: 'text', default: ExamStatus.UPCOMING })
  status: ExamStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

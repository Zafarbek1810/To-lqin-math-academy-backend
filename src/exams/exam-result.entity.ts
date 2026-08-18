import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('exam_results')
export class ExamResult {
  @PrimaryColumn()
  id: string;

  @Column()
  examId: string;

  @Column()
  studentId: string;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'integer', default: 0 })
  reward: number;

  @CreateDateColumn()
  createdAt: Date;
}

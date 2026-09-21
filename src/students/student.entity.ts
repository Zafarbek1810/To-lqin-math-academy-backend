import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityStatus } from '../common/enums';

@Entity('students')
export class Student {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  parentPhone: string;

  @Column({ nullable: true })
  groupId?: string;

  @Column({ type: 'text', default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @Column({ type: 'date' })
  joinedAt: string;

  @Column({ type: 'integer', default: 0 })
  rewardEarned: number;

  @Column({ type: 'integer', default: 0 })
  rewardSpent: number;

  @Column({ type: 'float', default: 0 })
  attendanceRate: number;

  @Column({ type: 'float', default: 0 })
  homeworkRate: number;

  @Column({ type: 'float', default: 0 })
  examAvg: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

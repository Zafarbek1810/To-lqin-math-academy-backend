import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityStatus } from '../common/enums';

@Entity('groups')
export class Group {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  subjectId: string;

  @Column()
  teacherId: string;

  /** JSON array of day names, e.g. ["Dushanba","Chorshanba"] */
  @Column({ type: 'simple-json' })
  days: string[];

  @Column({ type: 'text', default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @Column({ nullable: true })
  lastLessonAt?: string;

  @Column({ default: false })
  lessonLocked: boolean;

  @Column({ type: 'datetime', nullable: true })
  lockExpiresAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

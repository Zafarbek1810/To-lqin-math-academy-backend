import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('lessons')
export class Lesson {
  @PrimaryColumn()
  id: string;

  @Column()
  groupId: string;

  @Column()
  teacherId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: true })
  saved: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

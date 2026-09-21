import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subjects')
export class Subject {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  name: string;

  /** false bo'lsa yo'qlama va vazifa tekshiriladi, lekin pul mukofoti berilmaydi */
  @Column({ default: true })
  rewardsEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

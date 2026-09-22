import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApplicationStatus } from '../common/enums';

@Entity('applications')
export class Application {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ default: '' })
  subject: string;

  @Column({ type: 'text', default: '' })
  message: string;

  @Column({ type: 'text', default: ApplicationStatus.NEW })
  status: ApplicationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

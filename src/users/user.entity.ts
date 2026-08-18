import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityStatus, Role } from '../common/enums';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'text' })
  role: Role;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ type: 'text', default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @Column({ type: 'date' })
  joinedAt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

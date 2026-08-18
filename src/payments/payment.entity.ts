import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod, PaymentStatus } from '../common/enums';

@Entity('payments')
export class Payment {
  @PrimaryColumn()
  id: string;

  @Column()
  studentId: string;

  @Column()
  groupId: string;

  @Column({ type: 'integer', default: 0 })
  amount: number;

  @Column({ type: 'text', default: PaymentMethod.CASH })
  method: PaymentMethod;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ nullable: true })
  receptionId?: string;

  @Column()
  month: string;

  @Column({ type: 'text', default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

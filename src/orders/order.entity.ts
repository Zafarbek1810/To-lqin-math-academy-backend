import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../common/enums';

@Entity('orders')
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  studentId: string;

  @Column()
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'integer' })
  totalReward: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', default: OrderStatus.NEW })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

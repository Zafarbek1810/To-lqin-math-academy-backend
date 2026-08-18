import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityStatus } from '../common/enums';

@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'text', default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @Column({ nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

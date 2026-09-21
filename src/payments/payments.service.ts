import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatus } from '../common/enums';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment) private repo: Repository<Payment>,
  ) {}

  findAll(filters?: { studentId?: string; month?: string; status?: PaymentStatus }) {
    const where: Record<string, string> = {};
    if (filters?.studentId) where.studentId = filters.studentId;
    if (filters?.month) where.month = filters.month;
    if (filters?.status) where.status = filters.status;
    return this.repo.find({ where, order: { date: 'DESC' } });
  }

  async findOne(id: string) {
    const payment = await this.repo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException("To'lov topilmadi");
    return payment;
  }

  create(dto: CreatePaymentDto, receptionId: string) {
    const payment = this.repo.create({
      id: `pay${Date.now()}`,
      studentId: dto.studentId,
      groupId: dto.groupId,
      amount: dto.amount,
      method: dto.method,
      month: dto.month,
      status: dto.status ?? PaymentStatus.PAID,
      date: dto.date ?? new Date().toISOString().slice(0, 10),
      receptionId,
    });
    return this.repo.save(payment);
  }

  async update(id: string, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);
    Object.assign(payment, dto);
    if (dto.status === PaymentStatus.PAID && !payment.date) {
      payment.date = new Date().toISOString().slice(0, 10);
    }
    return this.repo.save(payment);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    await this.repo.remove(payment);
    return { deleted: true };
  }

  async summary(month?: string) {
    const m = month ?? new Date().toISOString().slice(5, 7);
    const payments = await this.repo.find({ where: { month: m } });
    const paid = payments.filter((p) => p.status === PaymentStatus.PAID);
    const overdue = payments.filter((p) => p.status === PaymentStatus.OVERDUE);
    return {
      month: m,
      totalAmount: paid.reduce((s, p) => s + p.amount, 0),
      paidCount: paid.length,
      overdueCount: overdue.length,
      payments,
    };
  }
}

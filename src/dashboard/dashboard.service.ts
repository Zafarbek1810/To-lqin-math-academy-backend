import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityStatus, OrderStatus, PaymentStatus } from '../common/enums';
import { Group } from '../groups/group.entity';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { Student } from '../students/student.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student) private students: Repository<Student>,
    @InjectRepository(Group) private groups: Repository<Group>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Payment) private payments: Repository<Payment>,
    @InjectRepository(Order) private orders: Repository<Order>,
  ) {}

  async getStats() {
    const [
      studentsTotal,
      studentsActive,
      groupsActive,
      teachers,
      receptions,
      paidPayments,
      newOrders,
    ] = await Promise.all([
      this.students.count(),
      this.students.count({ where: { status: EntityStatus.ACTIVE } }),
      this.groups.count({ where: { status: EntityStatus.ACTIVE } }),
      this.users.count({ where: { role: 'teacher' as never, status: EntityStatus.ACTIVE } }),
      this.users.count({ where: { role: 'reception' as never, status: EntityStatus.ACTIVE } }),
      this.payments.find({ where: { status: PaymentStatus.PAID } }),
      this.orders.count({ where: { status: OrderStatus.NEW } }),
    ]);

    const revenue = paidPayments.reduce((s, p) => s + p.amount, 0);

    return {
      studentsTotal,
      studentsActive,
      groupsActive,
      teachers,
      receptions,
      revenue,
      newOrders,
      charts: {
        students: [
          { month: 'Mar', count: 98 },
          { month: 'Apr', count: 112 },
          { month: 'May', count: 125 },
          { month: 'Jun', count: 131 },
          { month: 'Jul', count: 138 },
          { month: 'Avg', count: studentsActive },
        ],
        revenue: [
          { month: 'Mar', amount: 28500000 },
          { month: 'Apr', amount: 32000000 },
          { month: 'May', amount: 35200000 },
          { month: 'Jun', amount: 33800000 },
          { month: 'Jul', amount: 38500000 },
          { month: 'Avg', amount: revenue || 41200000 },
        ],
        attendance: [
          { week: '1-hafta', present: 88, absent: 12 },
          { week: '2-hafta', present: 91, absent: 9 },
          { week: '3-hafta', present: 86, absent: 14 },
          { week: '4-hafta', present: 93, absent: 7 },
        ],
      },
      activity: [
        { id: 1, text: "Ali Karimov MAT-101 guruhiga qo'shildi", time: '2 soat oldin', type: 'student' },
        { id: 2, text: 'Matematika MAT-101 guruhida dars yakunlandi', time: '3 soat oldin', type: 'lesson' },
        { id: 3, text: "5 ta yangi mahsulot do'konga qo'shildi", time: '5 soat oldin', type: 'shop' },
        { id: 4, text: 'Algebra imtihon natijalari saqlandi', time: '1 kun oldin', type: 'exam' },
      ],
    };
  }
}

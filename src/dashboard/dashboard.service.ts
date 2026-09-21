import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AttendanceStatus,
  EntityStatus,
  OrderStatus,
  PaymentStatus,
} from '../common/enums';
import { Exam } from '../exams/exam.entity';
import { Group } from '../groups/group.entity';
import { LessonAttendance } from '../lessons/lesson-attendance.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { Product } from '../products/product.entity';
import { Student } from '../students/student.entity';
import { User } from '../users/user.entity';

const MONTH_LABELS = [
  'Yan',
  'Fev',
  'Mar',
  'Apr',
  'May',
  'Iyun',
  'Iyul',
  'Avg',
  'Sen',
  'Okt',
  'Noy',
  'Dek',
];

type ActivityItem = { at: Date; text: string; type: string };

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Student) private students: Repository<Student>,
    @InjectRepository(Group) private groups: Repository<Group>,
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Payment) private payments: Repository<Payment>,
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Lesson) private lessons: Repository<Lesson>,
    @InjectRepository(LessonAttendance)
    private attendances: Repository<LessonAttendance>,
    @InjectRepository(Exam) private exams: Repository<Exam>,
    @InjectRepository(Product) private products: Repository<Product>,
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
      allStudents,
      allGroups,
      allLessons,
      allAttendances,
      recentStudents,
      recentLessons,
      recentOrders,
      recentExams,
      recentProducts,
      recentPayments,
    ] = await Promise.all([
      this.students.count(),
      this.students.count({ where: { status: EntityStatus.ACTIVE } }),
      this.groups.count({ where: { status: EntityStatus.ACTIVE } }),
      this.users.count({
        where: { role: 'teacher' as never, status: EntityStatus.ACTIVE },
      }),
      this.users.count({
        where: { role: 'reception' as never, status: EntityStatus.ACTIVE },
      }),
      this.payments.find({ where: { status: PaymentStatus.PAID } }),
      this.orders.count({ where: { status: OrderStatus.NEW } }),
      this.students.find(),
      this.groups.find(),
      this.lessons.find(),
      this.attendances.find(),
      this.students.find({ order: { createdAt: 'DESC' }, take: 8 }),
      this.lessons.find({ order: { createdAt: 'DESC' }, take: 8 }),
      this.orders.find({ order: { createdAt: 'DESC' }, take: 8 }),
      this.exams.find({ order: { createdAt: 'DESC' }, take: 8 }),
      this.products.find({ order: { createdAt: 'DESC' }, take: 8 }),
      this.payments.find({
        where: { status: PaymentStatus.PAID },
        order: { createdAt: 'DESC' },
        take: 8,
      }),
    ]);

    const revenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);
    const months = lastMonths(6);
    const groupName = (id?: string) =>
      allGroups.find((g) => g.id === id)?.name ?? id ?? '';

    const studentsChart = months.map((m) => ({
      month: m.label,
      count: allStudents.filter((s) => s.joinedAt?.startsWith(m.key)).length,
    }));

    const revenueChart = months.map((m) => ({
      month: m.label,
      amount: paidPayments
        .filter((p) => (p.date ?? '').startsWith(m.key))
        .reduce((sum, p) => sum + p.amount, 0),
    }));

    const lessonById = new Map(allLessons.map((l) => [l.id, l]));
    const attendanceWeeks = lastWeeks(4).map((week, i) => {
      let present = 0;
      let absent = 0;
      for (const row of allAttendances) {
        const lesson = lessonById.get(row.lessonId);
        if (!lesson?.date) continue;
        if (lesson.date < week.start || lesson.date > week.end) continue;
        if (row.attendance === AttendanceStatus.PRESENT) present += 1;
        else if (row.attendance === AttendanceStatus.ABSENT) absent += 1;
      }
      return { week: `${i + 1}-hafta`, present, absent };
    });

    const acts: ActivityItem[] = [];
    for (const s of recentStudents) {
      acts.push({
        at: s.createdAt,
        type: 'student',
        text: s.groupId
          ? `${s.name} ${groupName(s.groupId)} guruhiga qo'shildi`
          : `${s.name} qo'shildi`,
      });
    }
    for (const lesson of recentLessons) {
      acts.push({
        at: lesson.createdAt,
        type: 'lesson',
        text: `${groupName(lesson.groupId)} guruhida dars yakunlandi`,
      });
    }
    for (const order of recentOrders) {
      acts.push({
        at: order.createdAt,
        type: 'order',
        text: 'Yangi buyurtma qabul qilindi',
      });
    }
    for (const exam of recentExams) {
      acts.push({
        at: exam.createdAt,
        type: 'exam',
        text: `${exam.name} imtihoni saqlandi`,
      });
    }
    for (const product of recentProducts) {
      acts.push({
        at: product.createdAt,
        type: 'shop',
        text: `${product.name} mahsuloti qo'shildi`,
      });
    }
    for (const payment of recentPayments) {
      acts.push({
        at: payment.createdAt,
        type: 'payment',
        text: "To'lov qabul qilindi",
      });
    }

    acts.sort((a, b) => b.at.getTime() - a.at.getTime());
    const activity = acts.slice(0, 8).map((item, i) => ({
      id: i + 1,
      text: item.text,
      time: formatAgo(item.at),
      type: item.type,
    }));

    return {
      studentsTotal,
      studentsActive,
      groupsActive,
      teachers,
      receptions,
      revenue,
      newOrders,
      charts: {
        students: studentsChart,
        revenue: revenueChart,
        attendance: attendanceWeeks,
      },
      activity,
    };
  }
}

function lastMonths(n: number) {
  const now = new Date();
  const out: { key: string; label: string }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: MONTH_LABELS[d.getMonth()],
    });
  }
  return out;
}

function lastWeeks(n: number) {
  const out: { start: string; end: string }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(end.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    out.push({
      start: start.toISOString().slice(0, 10),
      end: end.toISOString().slice(0, 10),
    });
  }
  return out;
}

function formatAgo(date: Date): string {
  const ms = Date.now() - new Date(date).getTime();
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return 'hozirgina';
  if (s < 3600) return `${Math.floor(s / 60)} daqiqa oldin`;
  if (s < 86400) return `${Math.floor(s / 3600)} soat oldin`;
  const days = Math.floor(s / 86400);
  if (days === 1) return '1 kun oldin';
  if (days < 7) return `${days} kun oldin`;
  return new Date(date).toISOString().slice(0, 10);
}

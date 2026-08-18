import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import {
  AttendanceStatus,
  EntityStatus,
  ExamStatus,
  HomeworkStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Role,
} from '../common/enums';
import { ExamResult } from '../exams/exam-result.entity';
import { Exam } from '../exams/exam.entity';
import { Group } from '../groups/group.entity';
import { LessonAttendance } from '../lessons/lesson-attendance.entity';
import { Lesson } from '../lessons/lesson.entity';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { Product } from '../products/product.entity';
import { Student } from '../students/student.entity';
import { Subject } from '../subjects/subject.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private users: Repository<User>,
    @InjectRepository(Subject) private subjects: Repository<Subject>,
    @InjectRepository(Group) private groups: Repository<Group>,
    @InjectRepository(Student) private students: Repository<Student>,
    @InjectRepository(Product) private products: Repository<Product>,
    @InjectRepository(Order) private orders: Repository<Order>,
    @InjectRepository(Exam) private exams: Repository<Exam>,
    @InjectRepository(ExamResult) private examResults: Repository<ExamResult>,
    @InjectRepository(Lesson) private lessons: Repository<Lesson>,
    @InjectRepository(LessonAttendance)
    private attendances: Repository<LessonAttendance>,
    @InjectRepository(Payment) private payments: Repository<Payment>,
  ) {}

  async onModuleInit() {
    const count = await this.users.count();
    if (count > 0) {
      this.logger.log('DB allaqachon seed qilingan — o‘tkazib yuborildi');
      return;
    }
    this.logger.log('Seed maʼlumotlari yuklanmoqda...');
    await this.seed();
    this.logger.log('Seed tugadi ✓');
  }

  private async seed() {
    const hash = await bcrypt.hash('123', 10);

    await this.users.save([
      {
        id: 'admin1',
        name: 'Zafarbek Nazarov',
        username: 'admin',
        password: hash,
        role: Role.ADMIN,
        phone: '+998 90 000 00 01',
        status: EntityStatus.ACTIVE,
        joinedAt: '2022-01-01',
      },
      {
        id: 'e1',
        name: 'Sardor Toshmatov',
        username: 'teacher',
        password: hash,
        role: Role.TEACHER,
        phone: '+998 90 123 45 67',
        subject: 'Matematika',
        status: EntityStatus.ACTIVE,
        joinedAt: '2023-01-15',
      },
      {
        id: 'e2',
        name: 'Nilufar Hasanova',
        username: 'nilufar.h',
        password: hash,
        role: Role.TEACHER,
        phone: '+998 91 234 56 78',
        subject: 'Fizika',
        status: EntityStatus.ACTIVE,
        joinedAt: '2023-03-20',
      },
      {
        id: 'e3',
        name: 'Bobur Yusupov',
        username: 'bobur.y',
        password: hash,
        role: Role.TEACHER,
        phone: '+998 97 345 67 89',
        subject: 'Matematika',
        status: EntityStatus.ACTIVE,
        joinedAt: '2022-09-01',
      },
      {
        id: 'e4',
        name: 'Zulfiya Mirzayeva',
        username: 'reception',
        password: hash,
        role: Role.RECEPTION,
        phone: '+998 98 456 78 90',
        status: EntityStatus.ACTIVE,
        joinedAt: '2023-06-10',
      },
      {
        id: 'e5',
        name: 'Kamol Rajabov',
        username: 'kamol.r',
        password: hash,
        role: Role.RECEPTION,
        phone: '+998 93 567 89 01',
        status: EntityStatus.ACTIVE,
        joinedAt: '2024-01-05',
      },
      {
        id: 'e6',
        name: 'Barno Ergasheva',
        username: 'barno.e',
        password: hash,
        role: Role.TEACHER,
        phone: '+998 94 678 90 12',
        subject: 'Ingliz tili',
        status: EntityStatus.INACTIVE,
        joinedAt: '2022-05-12',
      },
    ]);

    await this.subjects.save([
      { id: 's1', name: 'Matematika' },
      { id: 's2', name: 'Fizika' },
      { id: 's3', name: 'Ingliz tili' },
      { id: 's4', name: 'Kimyo' },
      { id: 's5', name: 'Biologiya' },
      { id: 's6', name: 'Informatika' },
    ]);

    await this.groups.save([
      {
        id: 'g1',
        name: 'MAT-101',
        subjectId: 's1',
        teacherId: 'e1',
        days: ['Dushanba', 'Chorshanba', 'Juma', 'Yakshanba'],
        status: EntityStatus.ACTIVE,
        lessonLocked: false,
      },
      {
        id: 'g2',
        name: 'MAT-102',
        subjectId: 's1',
        teacherId: 'e3',
        days: ['Seshanba', 'Payshanba', 'Shanba'],
        status: EntityStatus.ACTIVE,
        lessonLocked: true,
        lockExpiresAt: new Date(Date.now() + 18 * 3600_000),
      },
      {
        id: 'g3',
        name: 'FIZ-101',
        subjectId: 's2',
        teacherId: 'e2',
        days: ['Dushanba', 'Chorshanba'],
        status: EntityStatus.ACTIVE,
        lessonLocked: false,
      },
      {
        id: 'g4',
        name: 'ING-101',
        subjectId: 's3',
        teacherId: 'e6',
        days: ['Seshanba', 'Payshanba'],
        status: EntityStatus.INACTIVE,
        lessonLocked: false,
      },
    ]);

    await this.students.save([
      { id: 'st1', name: 'Ali Karimov', phone: '+998 90 111 22 33', parentPhone: '+998 90 222 33 44', groupId: 'g1', status: EntityStatus.ACTIVE, joinedAt: '2024-09-01', rewardEarned: 12500, rewardSpent: 2000, attendanceRate: 95, homeworkRate: 88, examAvg: 82 },
      { id: 'st2', name: 'Madina Rahimova', phone: '+998 91 333 44 55', parentPhone: '+998 91 444 55 66', groupId: 'g1', status: EntityStatus.ACTIVE, joinedAt: '2024-09-01', rewardEarned: 18200, rewardSpent: 5000, attendanceRate: 98, homeworkRate: 95, examAvg: 91 },
      { id: 'st3', name: 'Azizbek Yusupov', phone: '+998 97 555 66 77', parentPhone: '+998 97 666 77 88', groupId: 'g2', status: EntityStatus.ACTIVE, joinedAt: '2024-10-15', rewardEarned: 8700, rewardSpent: 0, attendanceRate: 78, homeworkRate: 70, examAvg: 65 },
      { id: 'st4', name: 'Zarina Abdullayeva', phone: '+998 98 777 88 99', parentPhone: '+998 98 888 99 00', groupId: 'g3', status: EntityStatus.ACTIVE, joinedAt: '2024-09-15', rewardEarned: 15600, rewardSpent: 3000, attendanceRate: 92, homeworkRate: 85, examAvg: 78 },
      { id: 'st5', name: 'Jasur Normatov', phone: '+998 93 888 99 00', parentPhone: '+998 93 999 00 11', groupId: 'g1', status: EntityStatus.ACTIVE, joinedAt: '2024-11-01', rewardEarned: 5200, rewardSpent: 0, attendanceRate: 65, homeworkRate: 58, examAvg: 55 },
      { id: 'st6', name: 'Feruza Tursunova', phone: '+998 94 999 00 11', parentPhone: '+998 94 000 11 22', groupId: 'g4', status: EntityStatus.ACTIVE, joinedAt: '2024-08-20', rewardEarned: 22400, rewardSpent: 8000, attendanceRate: 99, homeworkRate: 96, examAvg: 94 },
      { id: 'st7', name: 'Sherzod Xolmatov', phone: '+998 99 000 11 22', parentPhone: '+998 99 111 22 33', groupId: 'g2', status: EntityStatus.INACTIVE, joinedAt: '2024-07-10', rewardEarned: 3100, rewardSpent: 0, attendanceRate: 45, homeworkRate: 40, examAvg: 38 },
      { id: 'st8', name: 'Dilnoza Raximova', phone: '+998 90 112 23 34', parentPhone: '+998 90 223 34 45', groupId: 'g3', status: EntityStatus.ACTIVE, joinedAt: '2024-10-01', rewardEarned: 9800, rewardSpent: 2000, attendanceRate: 88, homeworkRate: 82, examAvg: 74 },
    ]);

    await this.products.save([
      { id: 'p1', name: 'Daftar (48 varaqli)', price: 2000, quantity: 50, description: 'Sifatli yozuv daftari', status: EntityStatus.ACTIVE },
      { id: 'p2', name: "Ruchka to'plami", price: 1500, quantity: 30, description: "3 ta ruchkadan iborat to'plam", status: EntityStatus.ACTIVE },
      { id: 'p3', name: 'Matematika darsligi', price: 8000, quantity: 15, description: '9-sinf uchun matematika darsligi', status: EntityStatus.ACTIVE },
      { id: 'p4', name: 'Powerbank 10000mAh', price: 35000, quantity: 5, description: 'Yuqori sifatli powerbank', status: EntityStatus.ACTIVE },
      { id: 'p5', name: "Qalam va o'chirg'ich", price: 1000, quantity: 80, description: "HB qalam va yumshoq o'chirg'ich", status: EntityStatus.ACTIVE },
      { id: 'p6', name: "Sumka (o'quv)", price: 15000, quantity: 8, description: "O'quvchilar uchun sumka", status: EntityStatus.INACTIVE },
    ]);

    await this.orders.save([
      { id: 'ord1', studentId: 'st2', productId: 'p4', quantity: 1, totalReward: 35000, date: '2025-08-01', status: OrderStatus.DELIVERED },
      { id: 'ord2', studentId: 'st1', productId: 'p1', quantity: 2, totalReward: 4000, date: '2025-08-03', status: OrderStatus.CONFIRMED },
      { id: 'ord3', studentId: 'st6', productId: 'p3', quantity: 1, totalReward: 8000, date: '2025-08-05', status: OrderStatus.NEW },
      { id: 'ord4', studentId: 'st4', productId: 'p2', quantity: 1, totalReward: 1500, date: '2025-08-06', status: OrderStatus.NEW },
      { id: 'ord5', studentId: 'st8', productId: 'p5', quantity: 3, totalReward: 3000, date: '2025-07-28', status: OrderStatus.CANCELLED },
    ]);

    await this.exams.save([
      { id: 'ex1', name: 'Algebra — 1-chorak', subjectId: 's1', groupId: 'g1', teacherId: 'e1', date: '2025-08-05', maxScore: 100, status: ExamStatus.COMPLETED },
      { id: 'ex2', name: 'Geometriya — Chorak', subjectId: 's1', groupId: 'g2', teacherId: 'e3', date: '2025-08-10', maxScore: 100, status: ExamStatus.UPCOMING },
      { id: 'ex3', name: 'Mexanika — 1-test', subjectId: 's2', groupId: 'g3', teacherId: 'e2', date: '2025-07-25', maxScore: 100, status: ExamStatus.COMPLETED },
    ]);

    await this.examResults.save([
      { id: 'er1', examId: 'ex1', studentId: 'st1', score: 87, reward: 3000 },
      { id: 'er2', examId: 'ex1', studentId: 'st2', score: 95, reward: 5000 },
      { id: 'er3', examId: 'ex1', studentId: 'st5', score: 42, reward: 1000 },
      { id: 'er4', examId: 'ex3', studentId: 'st4', score: 78, reward: 3000 },
      { id: 'er5', examId: 'ex3', studentId: 'st8', score: 61, reward: 2000 },
    ]);

    await this.lessons.save([
      { id: 'l1', groupId: 'g1', teacherId: 'e1', date: '2025-08-07', saved: true },
      { id: 'l2', groupId: 'g1', teacherId: 'e1', date: '2025-08-05', saved: true },
    ]);

    await this.attendances.save([
      { id: 'la1', lessonId: 'l1', studentId: 'st1', attendance: AttendanceStatus.PRESENT, homework: HomeworkStatus.FULL, attendanceReward: 500, homeworkReward: 500 },
      { id: 'la2', lessonId: 'l1', studentId: 'st2', attendance: AttendanceStatus.PRESENT, homework: HomeworkStatus.FULL, attendanceReward: 500, homeworkReward: 500 },
      { id: 'la3', lessonId: 'l1', studentId: 'st5', attendance: AttendanceStatus.ABSENT, homework: HomeworkStatus.NONE, attendanceReward: 0, homeworkReward: 0 },
      { id: 'la4', lessonId: 'l2', studentId: 'st1', attendance: AttendanceStatus.PRESENT, homework: HomeworkStatus.PARTIAL, attendanceReward: 500, homeworkReward: 200 },
      { id: 'la5', lessonId: 'l2', studentId: 'st2', attendance: AttendanceStatus.PRESENT, homework: HomeworkStatus.FULL, attendanceReward: 500, homeworkReward: 500 },
      { id: 'la6', lessonId: 'l2', studentId: 'st5', attendance: AttendanceStatus.PRESENT, homework: HomeworkStatus.NONE, attendanceReward: 500, homeworkReward: 0 },
    ]);

    await this.payments.save([
      { id: 'pay1', studentId: 'st1', groupId: 'g1', amount: 300000, method: PaymentMethod.CASH, date: '2025-08-01', receptionId: 'e4', month: '08', status: PaymentStatus.PAID },
      { id: 'pay2', studentId: 'st2', groupId: 'g1', amount: 300000, method: PaymentMethod.CARD, date: '2025-08-02', receptionId: 'e4', month: '08', status: PaymentStatus.PAID },
      { id: 'pay3', studentId: 'st3', groupId: 'g2', amount: 300000, method: PaymentMethod.CASH, date: '2025-07-31', receptionId: 'e5', month: '07', status: PaymentStatus.PAID },
      { id: 'pay4', studentId: 'st4', groupId: 'g3', amount: 250000, method: PaymentMethod.OTHER, date: '2025-08-05', receptionId: 'e4', month: '08', status: PaymentStatus.PAID },
      { id: 'pay5', studentId: 'st5', groupId: 'g1', amount: 0, method: PaymentMethod.CASH, date: undefined, receptionId: undefined, month: '08', status: PaymentStatus.OVERDUE },
    ]);
  }
}

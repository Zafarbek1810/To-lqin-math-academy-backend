import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Subject,
      Group,
      Student,
      Product,
      Order,
      Exam,
      ExamResult,
      Lesson,
      LessonAttendance,
      Payment,
    ]),
  ],
  providers: [SeedService],
})
export class SeedModule {}

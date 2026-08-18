import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { DashboardModule } from './dashboard/dashboard.module';
import { ExamResult } from './exams/exam-result.entity';
import { Exam } from './exams/exam.entity';
import { ExamsModule } from './exams/exams.module';
import { Group } from './groups/group.entity';
import { GroupsModule } from './groups/groups.module';
import { LessonAttendance } from './lessons/lesson-attendance.entity';
import { Lesson } from './lessons/lesson.entity';
import { LessonsModule } from './lessons/lessons.module';
import { Order } from './orders/order.entity';
import { OrdersModule } from './orders/orders.module';
import { Payment } from './payments/payment.entity';
import { PaymentsModule } from './payments/payments.module';
import { Product } from './products/product.entity';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';
import { Student } from './students/student.entity';
import { StudentsModule } from './students/students.module';
import { Subject } from './subjects/subject.entity';
import { SubjectsModule } from './subjects/subjects.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: process.env.DB_PATH || 'tolqin.sqlite',
      entities: [
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
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    SubjectsModule,
    GroupsModule,
    StudentsModule,
    LessonsModule,
    ExamsModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    DashboardModule,
    SeedModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

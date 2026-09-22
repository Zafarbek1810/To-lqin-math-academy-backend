import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './applications/application.entity';
import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { isProduction } from './common/config';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { HealthController } from './common/health.controller';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '5432'), 10),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'tolqin'),
        // Beget Cloud kabi boshqariladigan bazalar uchun: DB_SSL=true
        ssl:
          config.get<string>('DB_SSL', 'false') === 'true'
            ? { rejectUnauthorized: false }
            : false,
        entities: [
          Application,
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
        // Production da default `false`: jadval sxemasini avtomatik o'zgartirish
        // ma'lumot yo'qolishiga olib kelishi mumkin. Birinchi ishga tushirishda
        // jadvallarni yaratish uchun vaqtincha DB_SYNC=true qilib qo'yiladi.
        synchronize:
          config.get<string>(
            'DB_SYNC',
            isProduction() ? 'false' : 'true',
          ) === 'true',
      }),
    }),
    AuthModule,
    ApplicationsModule,
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
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../groups/group.entity';
import { Order } from '../orders/order.entity';
import { Payment } from '../payments/payment.entity';
import { Student } from '../students/student.entity';
import { User } from '../users/user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Group, User, Payment, Order]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

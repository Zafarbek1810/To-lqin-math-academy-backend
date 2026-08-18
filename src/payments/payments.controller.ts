import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, Roles } from '../common/decorators';
import { PaymentStatus, Role } from '../common/enums';
import { User } from '../users/user.entity';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.RECEPTION)
  findAll(
    @Query('studentId') studentId?: string,
    @Query('month') month?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentsService.findAll({ studentId, month, status });
  }

  @Get('summary')
  @Roles(Role.ADMIN, Role.RECEPTION)
  summary(@Query('month') month?: string) {
    return this.paymentsService.summary(month);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RECEPTION)
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTION)
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: User) {
    return this.paymentsService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTION)
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}

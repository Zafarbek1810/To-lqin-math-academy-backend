import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OrderStatus } from '../../common/enums';

export class CreateOrderDto {
  @IsString()
  studentId: string;

  @IsString()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

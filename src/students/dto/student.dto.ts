import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EntityStatus } from '../../common/enums';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  parentPhone: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsString()
  joinedAt?: string;
}

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  parentPhone?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;

  @IsOptional()
  @IsString()
  joinedAt?: string;

  @IsOptional()
  @IsNumber()
  rewardEarned?: number;

  @IsOptional()
  @IsNumber()
  rewardSpent?: number;
}

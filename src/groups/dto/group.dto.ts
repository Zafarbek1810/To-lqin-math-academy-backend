import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EntityStatus } from '../../common/enums';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  subjectId: string;

  @IsString()
  teacherId: string;

  @IsArray()
  @IsString({ each: true })
  days: string[];

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  days?: string[];

  @IsOptional()
  @IsEnum(EntityStatus)
  status?: EntityStatus;
}

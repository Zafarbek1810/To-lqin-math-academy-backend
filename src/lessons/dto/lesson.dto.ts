import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AttendanceStatus, HomeworkStatus } from '../../common/enums';

export class AttendanceRowDto {
  @IsString()
  studentId: string;

  @IsEnum(AttendanceStatus)
  attendance: AttendanceStatus;

  @IsEnum(HomeworkStatus)
  homework: HomeworkStatus;
}

export class SaveLessonDto {
  @IsString()
  groupId: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRowDto)
  attendances: AttendanceRowDto[];
}

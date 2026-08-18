import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ExamStatus } from '../../common/enums';

export class CreateExamDto {
  @IsString()
  name: string;

  @IsString()
  subjectId: string;

  @IsString()
  groupId: string;

  @IsOptional()
  @IsString()
  teacherId?: string;

  @IsString()
  date: string;

  @IsOptional()
  @IsNumber()
  maxScore?: number;
}

export class ExamResultRowDto {
  @IsString()
  studentId: string;

  @IsNumber()
  @Min(0)
  @Max(1000)
  score: number;
}

export class SubmitExamResultsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamResultRowDto)
  results: ExamResultRowDto[];
}

export class UpdateExamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsEnum(ExamStatus)
  status?: ExamStatus;

  @IsOptional()
  @IsNumber()
  maxScore?: number;
}

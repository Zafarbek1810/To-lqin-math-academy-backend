import { IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  name?: string;
}

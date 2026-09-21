import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  rewardsEnabled?: boolean;
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  rewardsEnabled?: boolean;
}

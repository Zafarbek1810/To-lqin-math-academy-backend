import { IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  /** Parol almashtirilganda joriy parol talab qilinadi */
  @IsOptional()
  @IsString()
  currentPassword?: string;

  /** Bo'sh string yuborilsa — parol o'zgarmaydi */
  @ValidateIf((_, v) => v !== undefined && v !== null && v !== '')
  @IsString()
  @MinLength(3)
  password?: string;
}

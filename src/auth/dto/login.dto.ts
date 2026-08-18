import { IsString, MinLength } from 'class-validator';
// LoginDto — public auth endpoint body

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  @MinLength(3)
  password: string;
}

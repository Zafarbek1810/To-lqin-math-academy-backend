import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(
      dto.username.toLowerCase().trim(),
    );
    if (!user) {
      throw new UnauthorizedException("Noto'g'ri username yoki parol");
    }

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) {
      throw new UnauthorizedException("Noto'g'ri username yoki parol");
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Hisob faol emas');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const { password: _, ...safeUser } = user;
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: safeUser,
    };
  }

  async me(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();
    const { password: _, ...safe } = user;
    return safe;
  }
}

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException();

    const name = dto.name?.trim();
    const username = dto.username?.trim();
    const nextPassword = dto.password?.trim();

    if (name !== undefined && name.length < 2) {
      throw new BadRequestException(
        "Ism kamida 2 ta belgidan iborat bo'lishi kerak",
      );
    }
    if (username !== undefined && username.length < 3) {
      throw new BadRequestException(
        "Username kamida 3 ta belgidan iborat bo'lishi kerak",
      );
    }
    if (nextPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('Joriy parolni kiriting');
      }
      const ok = await bcrypt.compare(dto.currentPassword, user.password);
      if (!ok) throw new BadRequestException("Joriy parol noto'g'ri");
    }

    return this.usersService.update(userId, {
      name,
      username,
      phone: dto.phone,
      password: nextPassword || undefined,
    });
  }
}

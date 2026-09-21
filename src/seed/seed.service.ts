import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { EntityStatus, Role } from '../common/enums';
import { User } from '../users/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(@InjectRepository(User) private users: Repository<User>) {}

  async onModuleInit() {
    const count = await this.users.count();
    if (count > 0) {
      this.logger.log('DB allaqachon seed qilingan — o‘tkazib yuborildi');
      return;
    }

    await this.seedAdminOnly();
  }

  private async seedAdminOnly() {
    const username = process.env.ADMIN_USERNAME?.trim() || 'admin';
    const name = process.env.ADMIN_NAME?.trim() || 'Administrator';
    const password = process.env.ADMIN_PASSWORD?.trim() || '123';

    await this.users.save({
      id: 'admin1',
      name,
      username,
      password: await bcrypt.hash(password, 10),
      role: Role.ADMIN,
      status: EntityStatus.ACTIVE,
      joinedAt: new Date().toISOString().slice(0, 10),
    });

    this.logger.log(`Admin akkaunt yaratildi: ${username}`);
  }
}

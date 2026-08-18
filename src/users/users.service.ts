import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { EntityStatus, Role } from '../common/enums';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
  ) {}

  private sanitize(user: User) {
    const { password: _, ...safe } = user;
    return safe;
  }

  async findAll(role?: Role) {
    const where = role ? { role } : {};
    const users = await this.repo.find({ where, order: { name: 'ASC' } });
    return users.map((u) => this.sanitize(u));
  }

  async findEmployees() {
    const users = await this.repo.find({
      where: [{ role: Role.TEACHER }, { role: Role.RECEPTION }],
      order: { name: 'ASC' },
    });
    return users.map((u) => this.sanitize(u));
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async create(dto: CreateUserDto) {
    const exists = await this.findByUsername(dto.username.toLowerCase());
    if (exists) throw new ConflictException('Username band');

    const user = this.repo.create({
      id: `e${Date.now()}`,
      name: dto.name,
      username: dto.username.toLowerCase(),
      password: await bcrypt.hash(dto.password, 10),
      role: dto.role,
      phone: dto.phone,
      subject: dto.subject,
      status: dto.status ?? EntityStatus.ACTIVE,
      joinedAt: new Date().toISOString().slice(0, 10),
    });
    const saved = await this.repo.save(user);
    return this.sanitize(saved);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Xodim topilmadi');

    if (dto.username && dto.username.toLowerCase() !== user.username) {
      const exists = await this.findByUsername(dto.username.toLowerCase());
      if (exists) throw new ConflictException('Username band');
      user.username = dto.username.toLowerCase();
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.subject !== undefined) user.subject = dto.subject;
    if (dto.status !== undefined) user.status = dto.status;
    if (dto.password && dto.password.trim()) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    const saved = await this.repo.save(user);
    return this.sanitize(saved);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Xodim topilmadi');
    await this.repo.remove(user);
    return { deleted: true };
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationStatus } from '../common/enums';
import { Application } from './application.entity';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application) private repo: Repository<Application>,
  ) {}

  findAll(status?: ApplicationStatus) {
    const where = status ? { status } : {};
    return this.repo.find({ where, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const application = await this.repo.findOne({ where: { id } });
    if (!application) throw new NotFoundException('Ariza topilmadi');
    return application;
  }

  async create(dto: CreateApplicationDto) {
    const name = dto.name.trim();
    const phone = dto.phone.trim();
    if (name.length < 2) {
      throw new BadRequestException("Ism kamida 2 ta belgidan iborat bo'lishi kerak");
    }
    if (phone.length < 7) {
      throw new BadRequestException("Telefon raqam to'liq kiritilmagan");
    }

    const application = this.repo.create({
      id: `app${Date.now()}`,
      name,
      phone,
      subject: dto.subject?.trim() || '',
      message: dto.message?.trim() || '',
      status: ApplicationStatus.NEW,
    });
    return this.repo.save(application);
  }

  async updateStatus(id: string, dto: UpdateApplicationStatusDto) {
    const application = await this.findOne(id);
    application.status = dto.status;
    return this.repo.save(application);
  }

  async remove(id: string) {
    const application = await this.findOne(id);
    await this.repo.remove(application);
    return { deleted: true };
  }
}

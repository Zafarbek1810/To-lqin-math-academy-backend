import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ApplicationStatus } from '../common/enums';
import { Application } from './application.entity';
import {
  CreateApplicationDto,
  UpdateApplicationStatusDto,
} from './dto/application.dto';

@Injectable()
export class ApplicationsService implements OnModuleInit {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    @InjectRepository(Application) private repo: Repository<Application>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    // Production da DB_SYNC o'chiq, shuning uchun yangi jadvalni o'zi yaratadi.
    await this.dataSource.query(`
      CREATE TABLE IF NOT EXISTS "applications" (
        "id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "subject" character varying NOT NULL DEFAULT '',
        "message" text NOT NULL DEFAULT '',
        "status" text NOT NULL DEFAULT 'new',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_applications" PRIMARY KEY ("id")
      )
    `);
    this.logger.log('applications jadvali tekshirildi');
  }

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

import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { EntityStatus, Role } from '../common/enums';
import { Group } from '../groups/group.entity';
import { Student } from '../students/student.entity';
import { User } from '../users/user.entity';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { Subject } from './subject.entity';

@Injectable()
export class SubjectsService implements OnModuleInit {
  private readonly logger = new Logger(SubjectsService.name);

  constructor(
    @InjectRepository(Subject) private repo: Repository<Subject>,
    @InjectRepository(Group) private groups: Repository<Group>,
    @InjectRepository(Student) private students: Repository<Student>,
    @InjectRepository(User) private users: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.dataSource.query(
      `ALTER TABLE IF EXISTS "subjects" ADD COLUMN IF NOT EXISTS "rewardsEnabled" boolean NOT NULL DEFAULT true`,
    );
    this.logger.log('subjects.rewardsEnabled ustuni tekshirildi');
  }

  async findAll() {
    const subjects = await this.repo.find({ order: { name: 'ASC' } });
    return Promise.all(subjects.map((s) => this.withCounts(s)));
  }

  async findOne(id: string) {
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) throw new NotFoundException('Fan topilmadi');
    return this.withCounts(subject);
  }

  private async withCounts(subject: Subject) {
    const groups = await this.groups.find({
      where: { subjectId: subject.id, status: EntityStatus.ACTIVE },
    });
    const groupIds = groups.map((g) => g.id);
    const teacherCount = await this.users.count({
      where: { role: Role.TEACHER, subject: subject.name, status: EntityStatus.ACTIVE },
    });
    let studentCount = 0;
    if (groupIds.length) {
      studentCount = await this.students
        .createQueryBuilder('s')
        .where('s.groupId IN (:...ids)', { ids: groupIds })
        .andWhere('s.status = :status', { status: EntityStatus.ACTIVE })
        .getCount();
    }
    return {
      ...subject,
      teacherCount,
      groupCount: groups.length,
      studentCount,
    };
  }

  async create(dto: CreateSubjectDto) {
    const exists = await this.repo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Bunday fan mavjud');
    const subject = this.repo.create({
      id: `s${Date.now()}`,
      name: dto.name,
      rewardsEnabled: dto.rewardsEnabled ?? true,
    });
    const saved = await this.repo.save(subject);
    return this.withCounts(saved);
  }

  async update(id: string, dto: UpdateSubjectDto) {
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) throw new NotFoundException('Fan topilmadi');
    if (dto.name) subject.name = dto.name;
    if (dto.rewardsEnabled !== undefined) {
      subject.rewardsEnabled = dto.rewardsEnabled;
    }
    const saved = await this.repo.save(subject);
    return this.withCounts(saved);
  }

  async remove(id: string) {
    const subject = await this.repo.findOne({ where: { id } });
    if (!subject) throw new NotFoundException('Fan topilmadi');
    await this.repo.remove(subject);
    return { deleted: true };
  }
}

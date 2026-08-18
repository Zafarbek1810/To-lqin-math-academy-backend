import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityStatus } from '../common/enums';
import { Student } from '../students/student.entity';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { Group } from './group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private repo: Repository<Group>,
    @InjectRepository(Student) private students: Repository<Student>,
  ) {}

  private async withMeta(group: Group) {
    const now = new Date();
    let lessonLocked = group.lessonLocked;
    let lockExpiresAt = group.lockExpiresAt;

    if (lessonLocked && lockExpiresAt && new Date(lockExpiresAt) <= now) {
      group.lessonLocked = false;
      group.lockExpiresAt = null;
      await this.repo.save(group);
      lessonLocked = false;
      lockExpiresAt = null;
    }

    const studentCount = await this.students.count({
      where: { groupId: group.id, status: EntityStatus.ACTIVE },
    });

    return {
      ...group,
      lessonLocked,
      lockExpiresAt: lockExpiresAt
        ? new Date(lockExpiresAt).toISOString()
        : undefined,
      studentCount,
    };
  }

  async findAll(teacherId?: string) {
    const where = teacherId ? { teacherId } : {};
    const groups = await this.repo.find({ where, order: { name: 'ASC' } });
    return Promise.all(groups.map((g) => this.withMeta(g)));
  }

  async findOne(id: string) {
    const group = await this.repo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Guruh topilmadi');
    return this.withMeta(group);
  }

  async create(dto: CreateGroupDto) {
    const group = this.repo.create({
      id: `g${Date.now()}`,
      name: dto.name,
      subjectId: dto.subjectId,
      teacherId: dto.teacherId,
      days: dto.days,
      status: dto.status ?? EntityStatus.ACTIVE,
      lessonLocked: false,
    });
    const saved = await this.repo.save(group);
    return this.withMeta(saved);
  }

  async update(id: string, dto: UpdateGroupDto) {
    const group = await this.repo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Guruh topilmadi');
    Object.assign(group, dto);
    const saved = await this.repo.save(group);
    return this.withMeta(saved);
  }

  async remove(id: string) {
    const group = await this.repo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Guruh topilmadi');
    await this.repo.remove(group);
    return { deleted: true };
  }

  async lockGroup(id: string, hours: number) {
    const group = await this.repo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Guruh topilmadi');
    group.lessonLocked = true;
    group.lockExpiresAt = new Date(Date.now() + hours * 3600_000);
    group.lastLessonAt = new Date().toISOString();
    return this.repo.save(group);
  }
}

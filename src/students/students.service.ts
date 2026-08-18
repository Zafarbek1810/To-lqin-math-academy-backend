import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityStatus } from '../common/enums';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { Student } from './student.entity';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private repo: Repository<Student>,
  ) {}

  findAll(groupId?: string) {
    const where = groupId ? { groupId } : {};
    return this.repo.find({ where, order: { name: 'ASC' } });
  }

  async findOne(id: string) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Talaba topilmadi');
    return student;
  }

  create(dto: CreateStudentDto) {
    const student = this.repo.create({
      id: `st${Date.now()}`,
      name: dto.name,
      phone: dto.phone,
      parentPhone: dto.parentPhone,
      groupId: dto.groupId || undefined,
      status: dto.status ?? EntityStatus.ACTIVE,
      joinedAt: dto.joinedAt || new Date().toISOString().slice(0, 10),
      rewardEarned: 0,
      rewardSpent: 0,
      attendanceRate: 0,
      homeworkRate: 0,
      examAvg: 0,
    });
    return this.repo.save(student);
  }

  async update(id: string, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    const { groupId, ...rest } = dto;
    Object.assign(student, rest);
    if (groupId !== undefined) {
      student.groupId = groupId || undefined;
    }
    return this.repo.save(student);
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.repo.remove(student);
    return { deleted: true };
  }

  async addReward(id: string, amount: number) {
    const student = await this.findOne(id);
    student.rewardEarned += amount;
    return this.repo.save(student);
  }

  async spendReward(id: string, amount: number) {
    const student = await this.findOne(id);
    const balance = student.rewardEarned - student.rewardSpent;
    if (amount > balance) {
      throw new BadRequestException('Mukofot balansi yetarli emas');
    }
    student.rewardSpent += amount;
    return this.repo.save(student);
  }
}

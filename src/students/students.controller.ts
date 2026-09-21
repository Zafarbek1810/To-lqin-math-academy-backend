import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get()
  findAll(
    @Query('groupId') groupId?: string,
    @Query('month') month?: string,
  ) {
    return this.studentsService.findAll(groupId, month);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('month') month?: string) {
    return this.studentsService.findOne(id, month);
  }

  @Post()
  @Roles(Role.ADMIN, Role.RECEPTION)
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.RECEPTION)
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}

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
import { CurrentUser, Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { User } from '../users/user.entity';
import {
  CreateExamDto,
  SubmitExamResultsDto,
  UpdateExamDto,
} from './dto/exam.dto';
import { ExamsService } from './exams.service';

@Controller('exams')
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Get()
  findAll(
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('mine') mine?: string,
    @CurrentUser() user?: User,
  ) {
    const tid =
      mine === '1' && user?.role === Role.TEACHER ? user.id : teacherId;
    return this.examsService.findAll({ groupId, teacherId: tid });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() dto: CreateExamDto, @CurrentUser() user: User) {
    return this.examsService.create(dto, user.id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  update(@Param('id') id: string, @Body() dto: UpdateExamDto) {
    return this.examsService.update(id, dto);
  }

  @Post(':id/results')
  @Roles(Role.ADMIN, Role.TEACHER)
  submitResults(@Param('id') id: string, @Body() dto: SubmitExamResultsDto) {
    return this.examsService.submitResults(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.examsService.remove(id);
  }
}

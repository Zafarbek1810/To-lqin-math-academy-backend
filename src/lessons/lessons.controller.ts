import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { User } from '../users/user.entity';
import { SaveLessonDto } from './dto/lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  findAll(
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
    @Query('mine') mine?: string,
    @CurrentUser() user?: User,
  ) {
    const tid =
      mine === '1' && user?.role === Role.TEACHER ? user.id : teacherId;
    return this.lessonsService.findAll({ groupId, teacherId: tid });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonsService.findOne(id);
  }

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  save(@Body() dto: SaveLessonDto, @CurrentUser() user: User) {
    return this.lessonsService.saveLesson(dto, user);
  }
}

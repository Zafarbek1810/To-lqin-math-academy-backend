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
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Get()
  findAll(
    @Query('teacherId') teacherId?: string,
    @Query('mine') mine?: string,
    @CurrentUser() user?: User,
  ) {
    const tid =
      mine === '1' && user?.role === Role.TEACHER ? user.id : teacherId;
    return this.groupsService.findAll(tid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateGroupDto) {
    return this.groupsService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}

import { Controller, Get } from '@nestjs/common';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(Role.ADMIN)
  getStats() {
    return this.dashboardService.getStats();
  }
}

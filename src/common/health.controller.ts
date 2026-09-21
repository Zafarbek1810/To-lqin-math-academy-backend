import { Controller, Get } from '@nestjs/common';
import { Public } from './decorators';

/**
 * Deploy va monitoring uchun ochiq tekshiruv endpointi.
 * Maxfiy ma'lumot qaytarmaydi.
 */
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}

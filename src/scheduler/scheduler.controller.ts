import { Controller, Get, UseGuards } from '@nestjs/common';
import { CourseExpirationService } from './course-expiration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('scheduler')
export class SchedulerController {
  constructor(private courseExpirationService: CourseExpirationService) {}

  /**
   * Manual test endpoint (faqat development uchun)
   */
  @Get('check-expirations')
  @UseGuards(JwtAuthGuard)
  async manualCheckExpirations() {
    await this.courseExpirationService.manualCheckExpiredEnrollments();
    return { message: 'Expiration check completed' };
  }
}

import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@GetUser('id') userId: number) {
    return this.notificationService.getUserNotifications(userId);
  }

  @Get('unread-count')
  async getUnreadCount(@GetUser('id') userId: number) {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.notificationService.markAsRead(+id, userId);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@GetUser('id') userId: number) {
    return this.notificationService.markAllAsRead(userId);
  }
}

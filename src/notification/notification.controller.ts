import { Controller, Get, Patch, Param, Headers } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(@Headers('user-id') userId: string) {
    if (!userId) {
      return [];
    }
    return this.notificationService.getUserNotifications(+userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Headers('user-id') userId: string) {
    if (!userId) {
      return { count: 0 };
    }
    const count = await this.notificationService.getUnreadCount(+userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Headers('user-id') userId: string) {
    if (!userId) {
      return;
    }
    return this.notificationService.markAsRead(+id, +userId);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Headers('user-id') userId: string) {
    if (!userId) {
      return;
    }
    return this.notificationService.markAllAsRead(+userId);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CourseExpirationService {
  private readonly logger = new Logger(CourseExpirationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Har kuni soat 00:00 da ishga tushadi va
   * muddati tugagan kurslarning statusini o'zgartiradi
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredEnrollments() {
    this.logger.log('Kurslarning muddatini tekshirish boshlandi...');

    try {
      const now = new Date();

      // Muddati tugagan va hali faol bo'lgan enrollmentlarni topish
      const expiredEnrollments = await this.prisma.enrollment.findMany({
        where: {
          isActive: true,
          expiresAt: {
            lte: now, // expiresAt <= hozirgi vaqt
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              phone: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (expiredEnrollments.length === 0) {
        this.logger.log('Muddati tugagan kurslar topilmadi');
        return;
      }

      this.logger.log(`${expiredEnrollments.length} ta muddati tugagan kurs topildi`);

      // Har bir muddati tugagan enrollmentni nofaol holatga o'tkazish
      for (const enrollment of expiredEnrollments) {
        await this.prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { isActive: false },
        });

        // Foydalanuvchiga bildirishnoma yuborish
        await this.prisma.notification.create({
          data: {
            userId: enrollment.userId,
            title: 'Kurs muddati tugadi',
            message: `"${enrollment.course.title}" kursiga kirish muddatingiz tugadi. Kursni qayta sotib olishingiz mumkin.`,
            type: 'course',
            icon: 'expired',
          },
        });

        this.logger.log(
          `Enrollment #${enrollment.id} nofaol holatga o'tkazildi - User: ${enrollment.user.firstName} (${enrollment.user.phone}), Course: ${enrollment.course.title}`
        );
      }

      this.logger.log('Kurslarning muddatini tekshirish tugallandi');
    } catch (error) {
      this.logger.error('Kurslarning muddatini tekshirishda xatolik yuz berdi', error);
    }
  }

  /**
   * Har kuni ertalab soat 09:00 da ishga tushadi va
   * 7 kundan keyin muddati tugaydigan kurslar haqida ogohlantirish yuboradi
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async notifyUpcomingExpirations() {
    this.logger.log('Yaqinlashib kelgan muddatlar haqida ogohlantirish boshlandi...');

    try {
      const now = new Date();
      const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      // 7 kundan keyin muddati tugaydigan enrollmentlar
      const upcomingExpirations = await this.prisma.enrollment.findMany({
        where: {
          isActive: true,
          expiresAt: {
            gte: now,
            lte: sevenDaysLater,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (upcomingExpirations.length === 0) {
        this.logger.log('Yaqin kunlarda muddati tugaydigan kurslar topilmadi');
        return;
      }

      this.logger.log(`${upcomingExpirations.length} ta yaqinda muddati tugaydigan kurs topildi`);

      for (const enrollment of upcomingExpirations) {
        const daysLeft = Math.ceil(
          (enrollment.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Faqat hali bildirishnoma yuborilmagan bo'lsa yuborish
        const existingNotification = await this.prisma.notification.findFirst({
          where: {
            userId: enrollment.userId,
            message: {
              contains: `"${enrollment.course.title}" kursiga kirish muddati ${daysLeft} kundan keyin tugaydi`,
            },
            createdAt: {
              gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // oxirgi 24 soat ichida
            },
          },
        });

        if (!existingNotification) {
          await this.prisma.notification.create({
            data: {
              userId: enrollment.userId,
              title: 'Kurs muddati tugashiga oz qoldi',
              message: `"${enrollment.course.title}" kursiga kirish muddati ${daysLeft} kundan keyin tugaydi. O'z vaqtida yangilashni unutmang!`,
              type: 'course',
              icon: 'warning',
            },
          });

          this.logger.log(
            `Ogohlantirish yuborildi - User: ${enrollment.user.firstName}, Course: ${enrollment.course.title}, Qolgan kunlar: ${daysLeft}`
          );
        }
      }

      this.logger.log('Ogohlantirish yuborish tugallandi');
    } catch (error) {
      this.logger.error('Ogohlantirish yuborishda xatolik yuz berdi', error);
    }
  }

  /**
   * Test uchun manual chaqirish mumkin
   */
  async manualCheckExpiredEnrollments() {
    this.logger.log('Manual tekshirish boshlandi...');
    await this.checkExpiredEnrollments();
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Subscription narxlarini hisoblash
   * 1 oylik - to'liq narx
   * 6 oylik - 15% chegirma
   * 1 yillik - 25% chegirma
   */
  private calculateSubscriptionPrice(basePrice: number, duration: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR'): {
    price: number;
    discount: number;
    months: number;
  } {
    const basePriceNum = Number(basePrice);
    
    switch (duration) {
      case 'ONE_MONTH':
        return {
          price: basePriceNum,
          discount: 0,
          months: 1,
        };
      case 'SIX_MONTHS':
        const sixMonthTotal = basePriceNum * 6;
        const sixMonthDiscount = sixMonthTotal * 0.15; // 15% chegirma
        return {
          price: sixMonthTotal - sixMonthDiscount,
          discount: 15,
          months: 6,
        };
      case 'ONE_YEAR':
        const yearTotal = basePriceNum * 12;
        const yearDiscount = yearTotal * 0.25; // 25% chegirma
        return {
          price: yearTotal - yearDiscount,
          discount: 25,
          months: 12,
        };
      default:
        return {
          price: basePriceNum,
          discount: 0,
          months: 1,
        };
    }
  }

  /**
   * Muddatni hisoblash
   */
  private calculateExpirationDate(duration: 'ONE_MONTH' | 'SIX_MONTHS' | 'ONE_YEAR'): Date {
    const now = new Date();
    const months = this.calculateSubscriptionPrice(0, duration).months;
    now.setMonth(now.getMonth() + months);
    return now;
  }

  async createPayment(userId: number, dto: CreatePaymentDto) {
    const course = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.isFree) {
      throw new BadRequestException('This course is free');
    }

    // Check if already enrolled
    const existing = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: dto.courseId },
      },
    });

    if (existing) {
      throw new BadRequestException('Already enrolled in this course');
    }

    // Subscription narxini hisoblash
    const subscriptionInfo = this.calculateSubscriptionPrice(
      Number(course.price),
      dto.subscriptionDuration
    );

    let finalAmount = subscriptionInfo.price;
    let promoCodeId: number | undefined;
    let originalAmount = subscriptionInfo.price;
    let discount: number | undefined;
    let subscriptionDiscount = 0;
    
    if (subscriptionInfo.discount > 0) {
      subscriptionDiscount = Number(course.price) * subscriptionInfo.months - subscriptionInfo.price;
    }

    // Apply promo code if provided
    if (dto.promoCode) {
      const promoValidation = await this.applyPromoCode(userId, dto.promoCode, dto.courseId);
      finalAmount = promoValidation.finalPrice;
      const promo = await this.prisma.promoCode.findUnique({ where: { code: dto.promoCode } });
      promoCodeId = promo?.id;
      originalAmount = Number(promoValidation.originalPrice);
      discount = promoValidation.discountAmount;
    }

    // If paying with balance
    if (dto.method === 'BALANCE') {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true },
      });

      if (!user || Number(user.balance) < finalAmount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Deduct from balance
      await this.prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: finalAmount } },
      });

      // Create successful payment record
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          courseId: dto.courseId,
          promoCodeId,
          subscriptionDuration: dto.subscriptionDuration,
          amount: finalAmount,
          originalAmount,
          discount: discount || subscriptionDiscount,
          method: dto.method,
          type: 'COURSE_PURCHASE',
          status: 'SUCCESS',
          paymentDate: new Date(),
          transactionId: `BAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      });

      // Muddatni hisoblash
      const expirationDate = this.calculateExpirationDate(dto.subscriptionDuration);

      // Enroll user in course
      await this.prisma.enrollment.create({
        data: {
          userId,
          courseId: dto.courseId,
          subscriptionDuration: dto.subscriptionDuration,
          expiresAt: expirationDate,
        },
      });

      // Update course student count
      await this.prisma.course.update({
        where: { id: dto.courseId },
        data: { totalStudents: { increment: 1 } },
      });

      return {
        paymentId: payment.id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        message: 'Purchased successfully with balance',
      };
    }

    // Create payment record for gateway payment
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId: dto.courseId,
        promoCodeId,
        subscriptionDuration: dto.subscriptionDuration,
        amount: finalAmount,
        originalAmount,
        discount: discount || subscriptionDiscount,
        method: dto.method,
        type: 'COURSE_PURCHASE',
        status: 'PENDING',
        transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // TODO: Integrate with actual payment gateways (Click, Payme, Uzum)
    // For now, simulate success after 2 seconds
    
    return {
      paymentId: payment.id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      message: 'Payment initiated. Redirect to payment gateway.',
    };
  }

  async confirmPayment(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status
    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'SUCCESS',
        paymentDate: new Date(),
      },
    });

    // Muddatni hisoblash
    const expirationDate = this.calculateExpirationDate(payment.subscriptionDuration);

    // Enroll user in course
    await this.prisma.enrollment.create({
      data: {
        userId: payment.userId,
        courseId: payment.courseId,
        subscriptionDuration: payment.subscriptionDuration,
        expiresAt: expirationDate,
      },
    });

    // Update course student count
    await this.prisma.course.update({
      where: { id: payment.courseId },
      data: {
        totalStudents: { increment: 1 },
      },
    });

    return { message: 'Payment confirmed and enrolled successfully' };
  }

  async getPaymentHistory(userId: number) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            thumbnail: true,
            price: true,
          },
        },
        promoCode: {
          select: {
            code: true,
            discountPercent: true,
            discountAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserUsedPromoCodes(userId: number) {
    const usages = await this.prisma.promoCodeUsage.findMany({
      where: { userId },
      include: {
        promoCode: {
          select: {
            code: true,
            discountPercent: true,
            discountAmount: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            subtitle: true,
            thumbnail: true,
            price: true,
          },
        },
      },
      orderBy: { usedAt: 'desc' },
    });

    return usages;
  }

  async topupBalance(userId: number, amount: number, method: string) {
    // Create payment record for balance topup
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        amount,
        method: method as any,
        type: 'BALANCE_TOPUP',
        status: 'PENDING',
        transactionId: `TOPUP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    });

    // For now, auto-confirm (later integrate with payment gateways)
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        paymentDate: new Date(),
      },
    });

    // Update user balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balance: { increment: amount },
      },
    });

    return {
      message: 'Balance topped up successfully',
      amount,
      transactionId: payment.transactionId,
    };
  }

  async getUserBalance(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { balance: user.balance };
  }

  async validatePromoCode(userId: number, code: string, courseId: number) {
    // Promo code faqat course purchase uchun
    if (!courseId) {
      throw new BadRequestException('Promo code faqat kurs sotib olishda ishlatiladi');
    }

    // Find promo code
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code },
      include: { usages: true },
    });

    if (!promoCode) {
      throw new NotFoundException('Promo code topilmadi');
    }

    if (!promoCode.isActive) {
      throw new BadRequestException('Promo code faol emas');
    }

    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      throw new BadRequestException('Promo code muddati tugagan');
    }

    // Check if user has already used this promo code
    const userUsage = await this.prisma.promoCodeUsage.findUnique({
      where: {
        userId_promoCodeId: {
          userId,
          promoCodeId: promoCode.id,
        },
      },
    });

    if (userUsage) {
      throw new BadRequestException('Siz bu promo code\'dan foydalangansiz');
    }

    // Check user's total promo code usage count
    const userTotalUsage = await this.prisma.promoCodeUsage.count({
      where: { userId },
    });

    if (userTotalUsage >= 3) {
      throw new BadRequestException('Siz maksimal promo code limitiga yetdingiz (3 ta)');
    }

    // Check type-specific limits
    if (promoCode.type === 'SINGLE_USE') {
      if (promoCode.maxUsageCount && promoCode.currentUsageCount >= promoCode.maxUsageCount) {
        throw new BadRequestException('Promo code foydalanish limiti tugagan');
      }
    }

    // Get course details
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Kurs topilmadi');
    }

    // Calculate discount - either percentage or fixed amount
    let discountAmount: number;
    if (promoCode.discountPercent) {
      // Foizlik chegirma
      discountAmount = (Number(course.price) * promoCode.discountPercent) / 100;
    } else if (promoCode.discountAmount) {
      // Summalik chegirma
      discountAmount = Number(promoCode.discountAmount);
    } else {
      throw new BadRequestException('Promo code noto\'g\'ri sozlangan');
    }

    const finalPrice = Math.max(0, Number(course.price) - discountAmount);

    return {
      valid: true,
      promoCode: {
        code: promoCode.code,
        discountPercent: promoCode.discountPercent,
        discountAmount: promoCode.discountAmount,
      },
      course: {
        id: course.id,
        title: course.title,
        price: course.price,
      },
      originalPrice: course.price,
      discountAmount,
      finalPrice,
      message: promoCode.discountPercent
        ? `${promoCode.discountPercent}% chegirma qo'llanildi`
        : `${discountAmount.toLocaleString()} so'm chegirma qo'llanildi`,
    };
  }

  async getUserPromoCodeUsageCount(userId: number) {
    const count = await this.prisma.promoCodeUsage.count({
      where: { userId },
    });

    return {
      usedCount: count,
      remainingCount: 3 - count,
      maxCount: 3,
    };
  }

  async applyPromoCode(userId: number, code: string, courseId: number) {
    // Validate first
    const validation = await this.validatePromoCode(userId, code, courseId);

    // Get promo code
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code },
    });

    // Create usage record
    await this.prisma.promoCodeUsage.create({
      data: {
        userId,
        promoCodeId: promoCode.id,
        courseId,
        discount: validation.discountAmount,
      },
    });

    // Update promo code usage count
    await this.prisma.promoCode.update({
      where: { id: promoCode.id },
      data: { currentUsageCount: { increment: 1 } },
    });

    return validation;
  }
}

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

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

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount: dto.amount,
        method: dto.method,
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

    // Enroll user in course
    await this.prisma.enrollment.create({
      data: {
        userId: payment.userId,
        courseId: payment.courseId,
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
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

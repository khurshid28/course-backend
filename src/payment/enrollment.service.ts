import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const enrollments = await this.prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            banners: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              take: 1,
              select: {
                id: true,
                image: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Fetch payment information for each enrollment
    const enrollmentsWithPayment = await Promise.all(
      enrollments.map(async (enrollment) => {
        const payment = await this.prisma.payment.findFirst({
          where: {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            status: 'SUCCESS',
          },
          orderBy: {
            paymentDate: 'desc',
          },
          include: {
            promoCode: {
              select: {
                id: true,
                code: true,
                discount: true,
              },
            },
          },
        });

        return {
          ...enrollment,
          payment: payment || null,
        };
      }),
    );

    return enrollmentsWithPayment;
  }

  async findByStatus(isActive: boolean) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { isActive },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
            banners: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
              take: 1,
              select: {
                id: true,
                image: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Fetch payment information for each enrollment
    const enrollmentsWithPayment = await Promise.all(
      enrollments.map(async (enrollment) => {
        const payment = await this.prisma.payment.findFirst({
          where: {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            status: 'SUCCESS',
          },
          orderBy: {
            paymentDate: 'desc',
          },
          include: {
            promoCode: {
              select: {
                id: true,
                code: true,
                discount: true,
              },
            },
          },
        });

        return {
          ...enrollment,
          payment: payment || null,
        };
      }),
    );

    return enrollmentsWithPayment;
  }

  async findOne(id: number) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        user: true,
        course: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment #${id} not found`);
    }

    return enrollment;
  }

  async create(data: any) {
    return this.prisma.enrollment.create({
      data,
      include: {
        user: true,
        course: true,
      },
    });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.enrollment.update({
      where: { id },
      data,
      include: {
        user: true,
        course: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.enrollment.delete({ where: { id } });
    return { message: 'Enrollment deleted successfully' };
  }
}

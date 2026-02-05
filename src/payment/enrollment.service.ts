import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.enrollment.findMany({
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
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findByStatus(isActive: boolean) {
    return this.prisma.enrollment.findMany({
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
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
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

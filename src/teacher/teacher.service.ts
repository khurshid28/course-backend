import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async getAllTeachers() {
    return this.prisma.teacher.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async getTeacherById(id: number) {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}

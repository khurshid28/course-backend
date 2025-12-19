import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async findByCourseId(courseId: number) {
    return this.prisma.section.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        videos: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.section.findUnique({
      where: { id },
      include: {
        videos: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }
}

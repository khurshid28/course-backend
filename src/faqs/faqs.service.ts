import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async findByCourseId(courseId: number) {
    return this.prisma.courseFAQ.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }
}

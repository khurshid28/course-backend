import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async getCategoryById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            teacher: true,
          },
        },
      },
    });
  }
}

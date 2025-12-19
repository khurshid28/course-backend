import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async getActiveBanners() {
    return this.prisma.banner.findMany({
      where: { isActive: true },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async getBannerById(id: number) {
    return this.prisma.banner.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });
  }
}

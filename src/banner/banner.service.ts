import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBannerDto, UpdateBannerDto } from './dto/banner.dto';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async getActiveBanners() {
    return this.prisma.banner.findMany({
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

  async createBanner(createBannerDto: CreateBannerDto) {
    return this.prisma.banner.create({
      data: {
        ...createBannerDto,
        isActive: createBannerDto.isActive ?? true,
      },
    });
  }

  async updateBanner(id: number, updateBannerDto: UpdateBannerDto) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return this.prisma.banner.update({
      where: { id },
      data: updateBannerDto,
    });
  }

  async deleteBanner(id: number) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return this.prisma.banner.delete({ where: { id } });
  }
}

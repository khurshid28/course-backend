import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.video.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        section: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: [
        { courseId: 'asc' },
        { order: 'asc' },
      ],
    });
  }

  async findByCourse(courseId: number) {
    return this.prisma.video.findMany({
      where: { courseId },
      include: {
        section: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const video = await this.prisma.video.findUnique({
      where: { id },
      include: {
        course: true,
        section: true,
      },
    });

    if (!video) {
      throw new NotFoundException(`Video #${id} not found`);
    }

    return video;
  }

  async create(data: any) {
    return this.prisma.video.create({
      data,
      include: {
        course: true,
        section: true,
      },
    });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.video.update({
      where: { id },
      data,
      include: {
        course: true,
        section: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.video.delete({ where: { id } });
    return { message: 'Video deleted successfully' };
  }
}

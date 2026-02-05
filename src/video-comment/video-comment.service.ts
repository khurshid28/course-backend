import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVideoCommentDto } from './dto/video-comment.dto';

@Injectable()
export class VideoCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.videoComment.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
            avatar: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByVideo(videoId: number) {
    return this.prisma.videoComment.findMany({
      where: {
        videoId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.videoComment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
          },
        },
        video: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async create(createCommentDto: CreateVideoCommentDto) {
    return this.prisma.videoComment.create({
      data: createCommentDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.videoComment.delete({
      where: { id },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { courseId, comment, rating, screenshots } = createCommentDto;

    return this.prisma.courseComment.create({
      data: {
        userId,
        courseId,
        comment,
        rating,
        screenshots: JSON.stringify(screenshots || []),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findByCourseId(courseId: number) {
    return this.prisma.courseComment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number, userId: number) {
    // Only allow user to delete their own comments
    return this.prisma.courseComment.deleteMany({
      where: {
        id,
        userId,
      },
    });
  }
}

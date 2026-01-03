import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { courseId, comment, rating, images, screenshots } = createCommentDto;

    try {
      console.log('Service create - userId:', userId, 'courseId:', courseId, 'comment:', comment, 'rating:', rating);
      
      if (!userId || !courseId) {
        throw new Error(`Invalid data: userId=${userId}, courseId=${courseId}`);
      }

      const result = await this.prisma.courseComment.create({
        data: {
          userId,
          courseId,
          comment,
          rating: rating && rating > 0 ? rating : null,
          images: images && images.length > 0 ? JSON.stringify(images) : null,
          screenshots: screenshots && screenshots.length > 0 ? JSON.stringify(screenshots) : null,
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
      
      console.log('Comment created successfully:', result.id);
      return result;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error(`Izoh yaratishda xatolik: ${error.message}`);
    }
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

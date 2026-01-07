import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(userId: number, createCommentDto: CreateCommentDto) {
    const { courseId, comment, rating, images, screenshots } = createCommentDto;

    try {
      console.log('Service create - userId:', userId, 'courseId:', courseId, 'comment:', comment, 'rating:', rating);
      
      if (!userId || !courseId) {
        throw new Error(`Invalid data: userId=${userId}, courseId=${courseId}`);
      }

      // Rasmlar URL bo'lsa, download qilib saqlash
      let processedImages = images || [];
      if (images && images.length > 0) {
        processedImages = await Promise.all(
          images.map(async (imageUrl) => {
            if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
              try {
                const result = await this.uploadService.downloadImageFromUrl(imageUrl, 'images');
                return result.url;
              } catch (error) {
                console.error('Failed to download image:', error);
                return imageUrl;
              }
            }
            return imageUrl;
          })
        );
      }

      const result = await this.prisma.courseComment.create({
        data: {
          userId,
          courseId,
          comment,
          rating: rating && rating > 0 ? rating : null,
          images: processedImages && processedImages.length > 0 ? JSON.stringify(processedImages) : null,
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

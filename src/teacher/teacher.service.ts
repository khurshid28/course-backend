import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async getAllTeachers() {
    return this.prisma.teacher.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            avatar: true,
          },
        },
        courses: {
          select: {
            id: true,
            categoryId: true,
            title: true,
          },
        },
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async getTeacherById(id: number) {
    return this.prisma.teacher.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async rateTeacher(userId: number, teacherId: number, rating: number) {
    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Check if teacher exists
    const teacher = await this.prisma.teacher.findUnique({
      where: { id: teacherId },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Upsert user rating
    const existingRating = await this.prisma.teacherRating.findUnique({
      where: {
        userId_teacherId: {
          userId,
          teacherId,
        },
      },
    });

    if (existingRating) {
      // Update existing rating
      await this.prisma.teacherRating.update({
        where: {
          userId_teacherId: {
            userId,
            teacherId,
          },
        },
        data: { rating },
      });
    } else {
      // Create new rating
      await this.prisma.teacherRating.create({
        data: {
          userId,
          teacherId,
          rating,
        },
      });
    }

    // Recalculate teacher's average rating
    const ratings = await this.prisma.teacherRating.findMany({
      where: { teacherId },
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    // Update teacher's rating
    await this.prisma.teacher.update({
      where: { id: teacherId },
      data: {
        rating: averageRating,
        totalRatings,
      },
    });

    return {
      success: true,
      rating,
      averageRating,
      totalRatings,
    };
  }

  async getUserRating(userId: number, teacherId: number) {
    const rating = await this.prisma.teacherRating.findUnique({
      where: {
        userId_teacherId: {
          userId,
          teacherId,
        },
      },
    });

    return {
      userRating: rating?.rating || null,
    };
  }
}

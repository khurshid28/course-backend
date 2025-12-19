import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, CreateFeedbackDto } from './dto/course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses(userId?: number) {
    const courses = await this.prisma.course.findMany({
      where: { isActive: true },
      include: {
        teacher: true,
        category: true,
        _count: {
          select: {
            videos: true,
            enrollments: true,
            feedbacks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // If user is logged in, add enrollment and saved status
    if (userId) {
      const enrolledCourses = await this.prisma.enrollment.findMany({
        where: { userId, isActive: true },
        select: { courseId: true },
      });

      const savedCourses = await this.prisma.savedCourse.findMany({
        where: { userId },
        select: { courseId: true },
      });

      const enrolledIds = new Set(enrolledCourses.map((e) => e.courseId));
      const savedIds = new Set(savedCourses.map((s) => s.courseId));

      return courses.map((course) => ({
        ...course,
        isEnrolled: enrolledIds.has(course.id),
        isSaved: savedIds.has(course.id),
      }));
    }

    return courses;
  }

  async getCourseById(id: number, userId?: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        teacher: true,
        category: true,
        sections: {
          orderBy: { order: 'asc' },
          include: {
            videos: {
              orderBy: { id: 'asc' },
            },
          },
        },
        tests: {
          include: {
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
        faqs: {
          orderBy: { order: 'asc' },
        },
        comments: {
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
        },
        feedbacks: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                surname: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    let isEnrolled = false;
    let isSaved = false;
    let userFeedback = null;

    if (userId) {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId, courseId: id },
        },
      });
      isEnrolled = !!enrollment;

      const saved = await this.prisma.savedCourse.findUnique({
        where: {
          userId_courseId: { userId, courseId: id },
        },
      });
      isSaved = !!saved;

      userFeedback = await this.prisma.feedback.findUnique({
        where: {
          userId_courseId: { userId, courseId: id },
        },
      });
    }

    return {
      ...course,
      isEnrolled,
      isSaved,
      userFeedback,
    };
  }

  async saveCourse(userId: number, courseId: number) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.savedCourse.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      await this.prisma.savedCourse.delete({
        where: { id: existing.id },
      });
      return { message: 'Course removed from saved', saved: false };
    } else {
      await this.prisma.savedCourse.create({
        data: { userId, courseId },
      });
      return { message: 'Course saved successfully', saved: true };
    }
  }

  async getSavedCourses(userId: number) {
    const saved = await this.prisma.savedCourse.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            teacher: true,
            category: true,
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return saved.map((s) => s.course);
  }

  async addFeedback(userId: number, courseId: number, dto: CreateFeedbackDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is enrolled
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!enrollment) {
      throw new ForbiddenException('You must be enrolled to leave feedback');
    }

    // Upsert feedback
    const feedback = await this.prisma.feedback.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: {
        rating: dto.rating,
        comment: dto.comment,
      },
      create: {
        userId,
        courseId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    // Recalculate course rating
    const avgRating = await this.prisma.feedback.aggregate({
      where: { courseId },
      _avg: { rating: true },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: { rating: avgRating._avg.rating || 0 },
    });

    return feedback;
  }

  async getMyFeedback(userId: number, courseId: number) {
    return this.prisma.feedback.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  }
}

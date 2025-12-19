import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseByTeacherDto } from '../course/dto/create-course-by-teacher.dto';

@Injectable()
export class TeacherCoursesService {
  constructor(private prisma: PrismaService) {}

  async getTeacherCourses(userId: number) {
    // First check if user is a teacher
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new ForbiddenException('Faqat o\'qituvchilar kurs yaratishi mumkin');
    }

    return this.prisma.course.findMany({
      where: { teacherId: teacher.id },
      include: {
        category: true,
        _count: {
          select: {
            videos: true,
            enrollments: true,
            sections: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCourse(userId: number, createCourseDto: CreateCourseByTeacherDto) {
    // Check if user is a teacher
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new ForbiddenException('Faqat o\'qituvchilar kurs yaratishi mumkin');
    }

    const { categoryIds, ...courseData } = createCourseDto;

    // Create course with main category
    const course = await this.prisma.course.create({
      data: {
        ...courseData,
        teacherId: teacher.id,
        isActive: true,
      },
      include: {
        category: true,
        teacher: true,
      },
    });

    // If additional categories provided, create relations
    if (categoryIds && categoryIds.length > 0) {
      // You can create a CourseCategory junction table for multiple categories
      // For now, we'll keep it simple with single category
    }

    return course;
  }

  async getAllCategories() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }
}

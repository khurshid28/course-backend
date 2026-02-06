import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) {}

  async getAllTeachers() {
    const teachers = await this.prisma.teacher.findMany({      
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
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
        _count: {
          select: { 
            courses: true,
            comments: true,
            ratings: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    // Calculate total students for each teacher and transform name
    return teachers.map(teacher => {
      const totalStudents = teacher.courses.reduce(
        (sum, course) => sum + (course._count?.enrollments || 0),
        0,
      );
      
      // Split name into firstName and lastName
      const nameParts = teacher.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        id: teacher.id,
        firstName,
        lastName,
        phone: teacher.phone,
        email: teacher.email,
        bio: teacher.bio,
        image: teacher.avatar,
        password: '********', // Dummy password for frontend
        rating: teacher.rating,
        totalRatings: teacher.totalRatings,
        isActive: teacher.isActive,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
        totalStudents,
        _count: teacher._count,
        courses: teacher.courses,
        user: teacher.user,
      };
    });
  }

  async getTeacherById(id: number) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            category: true,
            _count: {
              select: {
                enrollments: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return null;
    }

    // Calculate total students (sum of all enrollments across all courses)
    const totalStudents = teacher.courses.reduce(
      (sum, course) => sum + (course._count?.enrollments || 0),
      0,
    );

    return {
      ...teacher,
      totalStudents,
    };
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

  async createTeacher(createTeacherDto: CreateTeacherDto) {
    const { firstName, lastName, image, password, ...rest } = createTeacherDto;
    const name = `${firstName} ${lastName}`.trim();
    
    return this.prisma.teacher.create({      data: {
        name,
        avatar: image,
        ...rest,
        isActive: createTeacherDto.isActive ?? true,
      },
      include: {
        _count: {
          select: {
            courses: true,
            comments: true,
            ratings: true,
          },
        },
      },
    });
  }

  async updateTeacher(id: number, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    const { firstName, lastName, image, password, ...rest } = updateTeacherDto;
    const data: any = { ...rest };
    
    if (firstName || lastName) {
      const newFirstName = firstName || teacher.name.split(' ')[0];
      const newLastName = lastName || teacher.name.split(' ').slice(1).join(' ');
      data.name = `${newFirstName} ${newLastName}`.trim();
    }
    
    if (image !== undefined) {
      data.avatar = image;
    }

    return this.prisma.teacher.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            courses: true,
            comments: true,
            ratings: true,
          },
        },
      },
    });
  }

  async deleteTeacher(id: number) {
    const teacher = await this.prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }

    return this.prisma.teacher.delete({ where: { id } });
  }
}

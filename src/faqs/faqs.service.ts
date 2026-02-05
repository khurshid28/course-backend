import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async findByCourseId(courseId: number) {
    return this.prisma.courseFAQ.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: number) {
    const faq = await this.prisma.courseFAQ.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return faq;
  }

  async createFaq(createFaqDto: CreateFaqDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createFaqDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createFaqDto.courseId} not found`);
    }

    // Get next order number if not provided
    let order = createFaqDto.order;
    if (!order) {
      const lastFaq = await this.prisma.courseFAQ.findFirst({
        where: { courseId: createFaqDto.courseId },
        orderBy: { order: 'desc' },
      });
      order = lastFaq ? lastFaq.order + 1 : 1;
    }

    return this.prisma.courseFAQ.create({
      data: {
        ...createFaqDto,
        order,
      },
    });
  }

  async updateFaq(id: number, updateFaqDto: UpdateFaqDto) {
    const faq = await this.prisma.courseFAQ.findUnique({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return this.prisma.courseFAQ.update({
      where: { id },
      data: updateFaqDto,
    });
  }

  async deleteFaq(id: number) {
    const faq = await this.prisma.courseFAQ.findUnique({ where: { id } });
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return this.prisma.courseFAQ.delete({ where: { id } });
  }
}

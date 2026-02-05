import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async findByCourseId(courseId: number) {
    return this.prisma.section.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        videos: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.section.findUnique({
      where: { id },
      include: {
        videos: {
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  async uploadVideo(
    sectionId: number,
    file: Express.Multer.File,
    title: string,
    subtitle?: string,
    description?: string,
    isFree: boolean = false,
    order?: number,
  ) {
    // Section mavjudligini tekshirish
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
      include: { course: true },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }

    const filePath = `./uploads/videos/${file.filename}`;
    
    // Video vaqtini olish
    let duration = 0;
    try {
      duration = await this.uploadService.getVideoDuration(filePath);
    } catch (error) {
      console.error('Error getting video duration:', error);
    }

    // Agar order berilmagan bo'lsa, oxiriga qo'shish
    let videoOrder = order;
    if (!videoOrder) {
      const lastVideo = await this.prisma.video.findFirst({
        where: { sectionId },
        orderBy: { order: 'desc' },
      });
      videoOrder = lastVideo ? lastVideo.order + 1 : 0;
    }

    // Video ma'lumotlarini saqlash
    const video = await this.prisma.video.create({
      data: {
        courseId: section.courseId,
        sectionId: sectionId,
        title: title,
        subtitle: subtitle,
        description: description,
        url: `/uploads/videos/${file.filename}`,
        duration: duration,
        size: BigInt(file.size),
        order: videoOrder,
        isFree: isFree,
      },
    });

    return {
      ...video,
      size: file.size,
      sizeInMB: (file.size / (1024 * 1024)).toFixed(2),
      durationFormatted: this.formatDuration(duration),
    };
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  async createSection(createSectionDto: CreateSectionDto) {
    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: createSectionDto.courseId },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${createSectionDto.courseId} not found`);
    }

    // Get next order number if not provided
    let order = createSectionDto.order;
    if (!order) {
      const lastSection = await this.prisma.section.findFirst({
        where: { courseId: createSectionDto.courseId },
        orderBy: { order: 'desc' },
      });
      order = lastSection ? lastSection.order + 1 : 1;
    }

    return this.prisma.section.create({
      data: {
        ...createSectionDto,
        order,
        isActive: createSectionDto.isActive ?? true,
      },
    });
  }

  async updateSection(id: number, updateSectionDto: UpdateSectionDto) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return this.prisma.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  async deleteSection(id: number) {
    const section = await this.prisma.section.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return this.prisma.section.delete({ where: { id } });
  }
}

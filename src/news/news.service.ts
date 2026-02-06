import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNewsDto, UpdateNewsDto } from './dto/news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.news.findMany({
      include: {
        author: {
          select: {
            id: true,
            login: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const news = await this.prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            login: true,
            fullName: true,
          },
        },
      },
    });

    if (!news) {
      throw new NotFoundException(`News with ID ${id} not found`);
    }

    return news;
  }

  async create(createNewsDto: CreateNewsDto & { authorId: number }) {
    return this.prisma.news.create({
      data: {
        title: createNewsDto.title,
        content: createNewsDto.content,
        image: createNewsDto.image,
        isPublished: createNewsDto.isPublished,
        authorId: createNewsDto.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            login: true,
            fullName: true,
          },
        },
      },
    });
  }

  async update(id: number, updateNewsDto: UpdateNewsDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.news.update({
      where: { id },
      data: updateNewsDto,
      include: {
        author: {
          select: {
            id: true,
            login: true,
            fullName: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.news.delete({
      where: { id },
    });
  }
}

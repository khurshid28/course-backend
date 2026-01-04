import { Controller, Get, Post, Param, UseGuards, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('sections')
@UseGuards(JwtAuthGuard)
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.sectionsService.findByCourseId(+courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sectionsService.findOne(+id);
  }

  @Post(':sectionId/upload-video')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/videos',
        filename: (req, file, cb) => {
          const originalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const filename = `${Date.now()}-${originalName}`;
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(mp4|avi|mov|wmv|flv|webm)$/)) {
          return cb(new Error('Only video files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
    }),
  )
  async uploadVideo(
    @Param('sectionId') sectionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title: string,
    @Body('subtitle') subtitle: string,
    @Body('description') description: string,
    @Body('isFree') isFree: string,
    @Body('order') order: string,
  ) {
    return this.sectionsService.uploadVideo(
      +sectionId,
      file,
      title,
      subtitle,
      description,
      isFree === 'true' || isFree === '1',
      order ? +order : undefined,
    );
  }
}

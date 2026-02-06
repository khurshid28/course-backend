import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SectionsService } from './sections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';

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

  @Post()
  createSection(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.createSection(createSectionDto);
  }

  @Patch(':id')
  updateSection(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.updateSection(id, updateSectionDto);
  }

  @Delete(':id')
  deleteSection(@Param('id', ParseIntPipe) id: number) {
    return this.sectionsService.deleteSection(id);
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

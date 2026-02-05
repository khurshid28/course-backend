import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    console.log('Creating comment with data:', {
      userId: req.user?.id,
      dto: createCommentDto,
    });
    return this.commentsService.create(req.user.id, createCommentDto);
  }

  @Post('legacy')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `comment-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Faqat rasm fayllarga ruxsat berilgan!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  createLegacy(
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('Creating comment with data:', {
      userId: req.user?.id,
      dto: createCommentDto,
      filesCount: files?.length || 0,
    });
    const images = files ? files.map((file) => `/uploads/images/${file.filename}`) : [];
    return this.commentsService.create(req.user.id, {
      ...createCommentDto,
      images,
    });
  }

  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.commentsService.findByCourseId(+courseId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.commentsService.remove(+id, req.user.userId);
  }
}

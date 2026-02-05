import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { VideoCommentService } from './video-comment.service';
import { CreateVideoCommentDto } from './dto/video-comment.dto';

@Controller('video-comments')
export class VideoCommentController {
  constructor(private readonly videoCommentService: VideoCommentService) {}

  @Get()
  async findAll(@Query('videoId') videoId?: string) {
    if (videoId) {
      return this.videoCommentService.findByVideo(+videoId);
    }
    return this.videoCommentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videoCommentService.findOne(id);
  }

  @Post()
  async create(@Body() createCommentDto: CreateVideoCommentDto) {
    return this.videoCommentService.create(createCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.videoCommentService.remove(id);
  }
}

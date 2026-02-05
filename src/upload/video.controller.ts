import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { VideoService } from './video.service';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    if (courseId) {
      return this.videoService.findByCourse(+courseId);
    }
    return this.videoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoService.findOne(+id);
  }

  @Post()
  create(@Body() createVideoDto: any) {
    return this.videoService.create(createVideoDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: any) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}

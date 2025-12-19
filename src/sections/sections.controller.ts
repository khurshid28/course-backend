import { Controller, Get, Param, UseGuards } from '@nestjs/common';
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
}

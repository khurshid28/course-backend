import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('faqs')
@UseGuards(JwtAuthGuard)
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.faqsService.findByCourseId(+courseId);
  }
}

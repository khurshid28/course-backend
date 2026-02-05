import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFaqDto, UpdateFaqDto } from './dto/faq.dto';

@Controller('faqs')
@UseGuards(JwtAuthGuard)
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.faqsService.findByCourseId(+courseId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.faqsService.findOne(id);
  }

  @Post()
  createFaq(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.createFaq(createFaqDto);
  }

  @Put(':id')
  updateFaq(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFaqDto: UpdateFaqDto,
  ) {
    return this.faqsService.updateFaq(id, updateFaqDto);
  }

  @Delete(':id')
  deleteFaq(@Param('id', ParseIntPipe) id: number) {
    return this.faqsService.deleteFaq(id);
  }
}

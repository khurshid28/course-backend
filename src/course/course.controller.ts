import { Controller, Get, Post, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateFeedbackDto } from './dto/course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('courses')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  getAllCourses(@GetUser('id') userId?: number) {
    return this.courseService.getAllCourses(userId);
  }

  @Get(':id')
  getCourseById(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId?: number) {
    return this.courseService.getCourseById(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  saveCourse(@GetUser('id') userId: number, @Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.saveCourse(userId, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved/list')
  getSavedCourses(@GetUser('id') userId: number) {
    return this.courseService.getSavedCourses(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('enrolled/list')
  getEnrolledCourses(@GetUser('id') userId: number) {
    return this.courseService.getEnrolledCourses(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/feedback')
  addFeedback(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) courseId: number,
    @Body() dto: CreateFeedbackDto,
  ) {
    return this.courseService.addFeedback(userId, courseId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/feedback/me')
  getMyFeedback(@GetUser('id') userId: number, @Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.getMyFeedback(userId, courseId);
  }
}

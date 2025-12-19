import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TeacherCoursesService } from './teacher-courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCourseByTeacherDto } from '../course/dto/create-course-by-teacher.dto';

@Controller('teacher/courses')
@UseGuards(JwtAuthGuard)
export class TeacherCoursesController {
  constructor(private readonly teacherCoursesService: TeacherCoursesService) {}

  @Get('my')
  getMyCourses(@Request() req) {
    return this.teacherCoursesService.getTeacherCourses(req.user.userId);
  }

  @Post()
  createCourse(@Request() req, @Body() createCourseDto: CreateCourseByTeacherDto) {
    return this.teacherCoursesService.createCourse(req.user.userId, createCourseDto);
  }

  @Get('categories')
  getAllCategories() {
    return this.teacherCoursesService.getAllCategories();
  }
}

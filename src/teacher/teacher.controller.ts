import { Controller, Get, Post, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('teachers')
export class TeacherController {
  constructor(private teacherService: TeacherService) {}

  @Get()
  getAllTeachers() {
    return this.teacherService.getAllTeachers();
  }

  @Get(':id')
  getTeacherById(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.getTeacherById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rate')
  rateTeacher(
    @Param('id', ParseIntPipe) teacherId: number,
    @Body('rating', ParseIntPipe) rating: number,
    @Req() req: any,
  ) {
    return this.teacherService.rateTeacher(req.user.id, teacherId, rating);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/user-rating')
  getUserRating(
    @Param('id', ParseIntPipe) teacherId: number,
    @Req() req: any,
  ) {
    return this.teacherService.getUserRating(req.user.id, teacherId);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { CreateTeacherDto, UpdateTeacherDto } from './dto/teacher.dto';
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

  @Post()
  @UseGuards(JwtAuthGuard)
  createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateTeacher(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTeacher(@Param('id', ParseIntPipe) id: number) {
    return this.teacherService.deleteTeacher(id);
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

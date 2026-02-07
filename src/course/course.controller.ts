import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe, Req, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, CreateFeedbackDto, UpdateCourseDto } from './dto/course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  getAllCourses(
    @GetUser('id') userId?: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
    @Query('includeInactive') includeInactive?: string,
    @Query('includeVideos') includeVideos?: string,
    @Query('includeEnrollments') includeEnrollments?: string,
  ) {
    return this.courseService.getAllCourses(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 10,
      isActive !== undefined ? isActive === 'true' : undefined,
      includeInactive === 'true',
      includeVideos === 'true',
      includeEnrollments === 'true',
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  getCourseById(@Param('id', ParseIntPipe) id: number, @GetUser('id') userId?: number) {
    return this.courseService.getCourseById(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteCourse(id);
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
  @Post(':id/rate')
  rateCourse(
    @Param('id', ParseIntPipe) courseId: number,
    @Body('rating', ParseIntPipe) rating: number,
    @GetUser('id') userId: number,
  ) {
    return this.courseService.rateCourse(userId, courseId, rating);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/rate')
  deleteRating(
    @Param('id', ParseIntPipe) courseId: number,
    @GetUser('id') userId: number,
  ) {
    return this.courseService.deleteRating(userId, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/user-rating')
  getUserCourseRating(
    @Param('id', ParseIntPipe) courseId: number,
    @GetUser('id') userId: number,
  ) {
    return this.courseService.getUserCourseRating(userId, courseId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/feedback/me')
  getMyFeedback(@GetUser('id') userId: number, @Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.getMyFeedback(userId, courseId);
  }
}

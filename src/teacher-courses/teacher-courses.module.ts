import { Module } from '@nestjs/common';
import { TeacherCoursesService } from './teacher-courses.service';
import { TeacherCoursesController } from './teacher-courses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherCoursesController],
  providers: [TeacherCoursesService],
  exports: [TeacherCoursesService],
})
export class TeacherCoursesModule {}

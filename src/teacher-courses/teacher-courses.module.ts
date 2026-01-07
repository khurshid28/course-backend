import { Module } from '@nestjs/common';
import { TeacherCoursesService } from './teacher-courses.service';
import { TeacherCoursesController } from './teacher-courses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeacherCoursesController],
  providers: [TeacherCoursesService, UploadService],
  exports: [TeacherCoursesService],
})
export class TeacherCoursesModule {}

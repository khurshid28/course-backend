import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';
import { TeacherModule } from './teacher/teacher.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { UploadModule } from './upload/upload.module';
import { SectionsModule } from './sections/sections.module';
import { TestsModule } from './tests/tests.module';
import { FaqsModule } from './faqs/faqs.module';
import { CommentsModule } from './comments/comments.module';
import { TeacherCoursesModule } from './teacher-courses/teacher-courses.module';
import { BannerModule } from './banner/banner.module';
import { NotificationModule } from './notification/notification.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    CourseModule,
    TeacherModule,
    CategoryModule,
    PaymentModule,
    UploadModule,
    SectionsModule,
    TestsModule,
    FaqsModule,
    CommentsModule,
    TeacherCoursesModule,
    BannerModule,
    NotificationModule,
    SchedulerModule,
  ],
})
export class AppModule {}

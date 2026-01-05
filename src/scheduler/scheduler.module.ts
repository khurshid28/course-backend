import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CourseExpirationService } from './course-expiration.service';
import { SchedulerController } from './scheduler.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
  ],
  controllers: [SchedulerController],
  providers: [CourseExpirationService],
  exports: [CourseExpirationService],
})
export class SchedulerModule {}

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}

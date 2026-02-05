import { Module } from '@nestjs/common';
import { VideoCommentController } from './video-comment.controller';
import { VideoCommentService } from './video-comment.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideoCommentController],
  providers: [VideoCommentService],
  exports: [VideoCommentService],
})
export class VideoCommentModule {}

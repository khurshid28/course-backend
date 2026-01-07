import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommentsController],
  providers: [CommentsService, UploadService],
  exports: [CommentsService],
})
export class CommentsModule {}

import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { PdfService } from './pdf.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TestsController],
  providers: [TestsService, PdfService],
  exports: [TestsService],
})
export class TestsModule {}

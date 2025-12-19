import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitTestDto } from './dto/submit-test.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { PdfService } from './pdf.service';

@Controller('tests')
@UseGuards(JwtAuthGuard)
export class TestsController {
  constructor(
    private readonly testsService: TestsService,
    private readonly pdfService: PdfService,
  ) {}

  @Post()
  createTest(@Body() createTestDto: CreateTestDto) {
    return this.testsService.createTest(createTestDto);
  }

  @Put(':id')
  updateTest(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.updateTest(+id, updateTestDto);
  }

  @Delete(':id')
  deleteTest(@Param('id') id: string) {
    return this.testsService.deleteTest(+id);
  }

  @Get('course/:courseId')
  findByCourseId(@Param('courseId') courseId: string) {
    return this.testsService.findByCourseId(+courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(+id);
  }

  @Post('submit')
  submitTest(@Request() req, @Body() submitTestDto: SubmitTestDto) {
    return this.testsService.submitTest(req.user.userId, submitTestDto);
  }

  @Get('certificates/my')
  getUserCertificates(@Request() req) {
    return this.testsService.getUserCertificates(req.user.userId);
  }

  @Get('certificates/:certificateNo')
  getCertificate(@Param('certificateNo') certificateNo: string) {
    return this.testsService.getCertificate(certificateNo);
  }

  @Get('certificates/:certificateNo/download')
  async downloadCertificate(
    @Param('certificateNo') certificateNo: string,
    @Res() res: Response,
  ) {
    const certificate = await this.testsService.getCertificate(certificateNo);
    
    if (!certificate) {
      res.status(404).json({ message: 'Sertifikat topilmadi' });
      return;
    }

    await this.pdfService.generateCertificate(
      {
        certificateNo: certificate.certificateNo,
        userName: `${certificate.user.firstName} ${certificate.user.surname}`,
        courseName: certificate.testResult.test.course.title,
        score: certificate.testResult.score,
        issuedAt: certificate.issuedAt,
      },
      res,
    );
  }
}

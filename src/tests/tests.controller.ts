import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Res } from '@nestjs/common';
import { Response } from 'express';
import { TestsService } from './tests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitTestDto } from './dto/submit-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
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
  findByCourseId(@Param('courseId') courseId: string, @Request() req) {
    return this.testsService.findByCourseId(+courseId, req.user.userId);
  }

  // Test session - boshlash
  @Post(':testId/start')
  async startTestSession(@Param('testId') testId: string, @Request() req) {
    return this.testsService.startTestSession(+testId, req.user.userId);
  }

  // Har bir javobni yuborish (real-time)
  @Post('session/:sessionId/answer')
  async submitAnswer(
    @Param('sessionId') sessionId: string,
    @Body() dto: SubmitAnswerDto,
    @Request() req,
  ) {
    return this.testsService.submitAnswer(+sessionId, dto, req.user.userId);
  }

  // Session holatini olish
  @Get('session/:sessionId/status')
  async getSessionStatus(@Param('sessionId') sessionId: string, @Request() req) {
    return this.testsService.getSessionStatus(+sessionId, req.user.userId);
  }

  // Test'ni tugatish va natija olish
  @Post('session/:sessionId/complete')
  async completeTest(@Param('sessionId') sessionId: string, @Request() req) {
    return this.testsService.completeTest(+sessionId, req.user.userId);
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

  // Public - har kim ko'rishi mumkin
  @Get('certificates/verify/:certificateNo')
  verifyCertificate(@Param('certificateNo') certificateNo: string) {
    return this.testsService.verifyCertificate(certificateNo);
  }

  // Certificate PDF download
  @Get('certificates/download/:certificateNo')
  async downloadCertificate(
    @Param('certificateNo') certificateNo: string,
    @Res() res: Response,
  ) {
    return this.testsService.downloadCertificate(certificateNo, res);
  }

  @Get('certificates/:certificateNo')
  getCertificate(@Param('certificateNo') certificateNo: string) {
    return this.testsService.getCertificate(certificateNo);
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async createTest(createTestDto: CreateTestDto) {
    const { questions, ...testData } = createTestDto;

    return this.prisma.test.create({
      data: {
        ...testData,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            correctAnswer: q.correctAnswer,
            order: q.order,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
  }

  async updateTest(id: number, updateTestDto: UpdateTestDto) {
    const { questions, ...testData } = updateTestDto;

    // Update test basic info
    const test = await this.prisma.test.update({
      where: { id },
      data: testData,
    });

    // Update questions if provided
    if (questions && questions.length > 0) {
      // Delete old questions
      await this.prisma.testQuestion.deleteMany({
        where: { testId: id },
      });

      // Create new questions
      await this.prisma.testQuestion.createMany({
        data: questions.map((q) => ({
          testId: id,
          question: q.question,
          options: JSON.stringify(q.options),
          correctAnswer: q.correctAnswer,
          order: q.order,
        })),
      });
    }

    return this.prisma.test.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  async deleteTest(id: number) {
    return this.prisma.test.delete({
      where: { id },
    });
  }

  async findByCourseId(courseId: number, userId?: number) {
    // User enrollment va tests
    if (userId) {
      const enrollment = await this.prisma.enrollment.findFirst({
        where: { userId, courseId },
      });

      const tests = await this.prisma.test.findMany({
        where: { courseId },
        include: {
          questions: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              question: true,
              options: true,
              order: true,
            },
          },
        },
      });

      // Check availability and last attempts
      const testsWithAvailability = await Promise.all(
        tests.map(async (test) => {
          const lastAttempt = await this.prisma.testResult.findFirst({
            where: { userId, testId: test.id },
            orderBy: { completedAt: 'desc' },
          });

          const isAvailable = this.checkTestAvailability(
            test,
            enrollment?.enrolledAt,
            lastAttempt?.completedAt,
          );

          return {
            ...test,
            lastAttempt,
            isAvailable,
          };
        }),
      );

      return testsWithAvailability;
    }

    // Public access (no user)
    return this.prisma.test.findMany({
      where: { courseId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
            // Don't send correctAnswer to frontend
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });
  }

  async submitTest(userId: number, submitTestDto: SubmitTestDto) {
    const { testId, answers } = submitTestDto;

    // Get test with questions including correct answers
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
        course: true,
      },
    });

    if (!test) {
      throw new BadRequestException('Test topilmadi');
    }

    // Calculate score
    let correctCount = 0;
    const questionMap = new Map(test.questions.map((q) => [q.id, q]));

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId);
      if (question && question.correctAnswer === answer.answer) {
        correctCount++;
      }
    }

    const score = (correctCount / test.questions.length) * 100;
    const isPassed = score >= test.passingScore;

    // Create test result
    const testResult = await this.prisma.testResult.create({
      data: {
        userId,
        testId,
        score,
        correctAnswers: correctCount,
        totalQuestions: test.questions.length,
        answers: JSON.stringify(answers),
        isPassed,
      },
    });

    // Generate certificate if passed
    let certificate = null;
    if (isPassed) {
      const certificateNo = `CERT-${Date.now()}-${userId}-${testId}`;
      certificate = await this.prisma.certificate.create({
        data: {
          userId,
          testResultId: testResult.id,
          certificateNo,
        },
        include: {
          user: {
            select: {
              firstName: true,
              surname: true,
            },
          },
          testResult: {
            include: {
              test: {
                include: {
                  course: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }

    return {
      testResult,
      certificate,
      score,
      isPassed,
      correctCount,
      totalQuestions: test.questions.length,
    };
  }

  async getUserCertificates(userId: number) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        testResult: {
          include: {
            test: {
              include: {
                course: {
                  select: {
                    title: true,
                    thumbnail: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async getCertificate(certificateNo: string) {
    return this.prisma.certificate.findUnique({
      where: { certificateNo },
      include: {
        user: {
          select: {
            firstName: true,
            surname: true,
          },
        },
        testResult: {
          include: {
            test: {
              include: {
                course: {
                  select: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // ==================== SESSION MANAGEMENT ====================

  async startTestSession(testId: number, userId: number) {
    // Test mavjudligini tekshirish
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            options: true,
            order: true,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Test topilmadi');
    }

    // User kursga enrollment qilganmi tekshirish
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: test.courseId,
      },
    });

    if (!enrollment) {
      throw new BadRequestException('Siz bu kursga yozilmagansiz');
    }

    // Aktiv session bormi tekshirish
    const activeSession = await this.prisma.testSession.findFirst({
      where: {
        userId,
        testId,
        isSubmitted: false,
        isExpired: false,
      },
    });

    if (activeSession) {
      // Agar vaqt o'tgan bo'lsa expired qilamiz
      if (new Date() > activeSession.expiresAt) {
        await this.prisma.testSession.update({
          where: { id: activeSession.id },
          data: { isExpired: true },
        });
      } else {
        // Aktiv session qaytaramiz
        return {
          sessionId: activeSession.id,
          test,
          startedAt: activeSession.startedAt,
          expiresAt: activeSession.expiresAt,
          currentAnswers: JSON.parse(activeSession.currentAnswers || '{}'),
        };
      }
    }

    // Yangi session yaratamiz
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + test.maxDuration);

    const session = await this.prisma.testSession.create({
      data: {
        userId,
        testId,
        expiresAt,
        currentAnswers: '{}',
      },
    });

    return {
      sessionId: session.id,
      test,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      currentAnswers: {},
    };
  }

  async submitAnswer(
    sessionId: number,
    dto: { questionId: number; selectedAnswer: number },
    userId: number,
  ) {
    const { questionId, selectedAnswer } = dto;
    
    // Session tekshirish
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session topilmadi');
    }

    if (session.isSubmitted) {
      throw new BadRequestException('Test allaqachon tugallangan');
    }

    if (session.isExpired || new Date() > session.expiresAt) {
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: { isExpired: true },
      });
      throw new BadRequestException('Vaqt tugadi');
    }

    // Savol test'ga tegishlimi tekshirish
    const question = session.test.questions.find((q) => q.id === questionId);
    if (!question) {
      throw new BadRequestException('Savol topilmadi');
    }

    // Javobni saqlash/yangilash
    await this.prisma.testSessionAnswer.upsert({
      where: {
        sessionId_questionId: {
          sessionId,
          questionId,
        },
      },
      update: {
        selectedAnswer,
        answeredAt: new Date(),
      },
      create: {
        sessionId,
        questionId,
        selectedAnswer,
      },
    });

    // Current answers'ni yangilash
    const currentAnswers = JSON.parse(session.currentAnswers || '{}');
    currentAnswers[questionId] = selectedAnswer;

    await this.prisma.testSession.update({
      where: { id: sessionId },
      data: {
        currentAnswers: JSON.stringify(currentAnswers),
      },
    });

    return {
      success: true,
      questionId,
      selectedAnswer,
    };
  }

  async getSessionStatus(sessionId: number, userId: number) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          include: {
            questions: {
              select: {
                id: true,
                order: true,
              },
            },
          },
        },
        answers: true,
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session topilmadi');
    }

    const now = new Date();
    const isExpired = session.isExpired || now > session.expiresAt;

    if (isExpired && !session.isExpired) {
      await this.prisma.testSession.update({
        where: { id: sessionId },
        data: { isExpired: true },
      });
    }

    const totalQuestions = session.test.questions.length;
    const answeredQuestions = session.answers.length;
    const remainingTime = Math.max(0, Math.floor((session.expiresAt.getTime() - now.getTime()) / 1000));

    return {
      sessionId: session.id,
      startedAt: session.startedAt,
      expiresAt: session.expiresAt,
      isExpired,
      isSubmitted: session.isSubmitted,
      remainingTimeSeconds: remainingTime,
      totalQuestions,
      answeredQuestions,
      currentAnswers: JSON.parse(session.currentAnswers || '{}'),
    };
  }

  async completeTest(sessionId: number, userId: number) {
    const session = await this.prisma.testSession.findUnique({
      where: { id: sessionId },
      include: {
        test: {
          include: {
            questions: true,
          },
        },
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!session || session.userId !== userId) {
      throw new NotFoundException('Session topilmadi');
    }

    if (session.isSubmitted) {
      throw new BadRequestException('Test allaqachon tugallangan');
    }

    // Natijani hisoblash
    let correctAnswers = 0;
    const totalQuestions = session.test.questions.length;

    session.answers.forEach((answer) => {
      if (answer.question.correctAnswer === answer.selectedAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= session.test.passingScore;

    // Session'ni tugatish
    await this.prisma.testSession.update({
      where: { id: sessionId },
      data: {
        isSubmitted: true,
        submittedAt: new Date(),
      },
    });

    // Test result yaratish
    const testResult = await this.prisma.testResult.create({
      data: {
        userId,
        testId: session.testId,
        score,
        correctAnswers,
        totalQuestions,
        answers: JSON.stringify(
          session.answers.map((a) => ({
            questionId: a.questionId,
            selectedAnswer: a.selectedAnswer,
            correctAnswer: a.question.correctAnswer,
          })),
        ),
        isPassed,
      },
    });

    // Certificate yaratish (agar minCorrectAnswers dan ko'p bo'lsa)
    let certificate = null;
    const shouldGetCertificate = 
      isPassed && 
      correctAnswers >= session.test.minCorrectAnswers;

    if (shouldGetCertificate) {
      // User ma'lumotlarini olish
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          surname: true,
          email: true,
        },
      });

      // Course ma'lumotlarini olish
      const course = await this.prisma.course.findUnique({
        where: { id: session.test.courseId },
        select: {
          title: true,
          teacher: {
            select: {
              name: true,
            },
          },
        },
      });

      const certificateNo = `CERT-${Date.now()}-${userId}`;
      certificate = await this.prisma.certificate.create({
        data: {
          userId,
          testResultId: testResult.id,
          certificateNo,
        },
      });

      // PDF yaratish (async, background'da)
      this.generateCertificatePDF(certificate.id, {
        certificateNo,
        userName: `${user.firstName || ''} ${user.surname || ''}`.trim() || 'User',
        courseName: course.title,
        teacherName: course.teacher?.name || 'Teacher',
        score,
        correctAnswers,
        totalQuestions,
        date: new Date(),
      }).catch((err) => console.error('PDF generation error:', err));
    }

    return {
      score,
      isPassed,
      correctAnswers,
      totalQuestions,
      passingScore: session.test.passingScore,
      minCorrectAnswers: session.test.minCorrectAnswers,
      receivedCertificate: shouldGetCertificate,
      certificate: shouldGetCertificate ? certificate : null,
      testResult,
    };
  }

  private checkTestAvailability(
    test: any,
    enrolledAt?: Date,
    lastAttemptAt?: Date,
  ): boolean {
    if (!enrolledAt) return false;

    const now = new Date();
    const daysSinceEnrollment = Math.floor(
      (now.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Check if available after days
    if (daysSinceEnrollment < test.availableAfterDays) {
      return false;
    }

    // Check availability type
    if (test.availabilityType === 'ANYTIME') {
      return true;
    }

    if (!lastAttemptAt) {
      return true; // First attempt
    }

    const daysSinceLastAttempt = Math.floor(
      (now.getTime() - lastAttemptAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    switch (test.availabilityType) {
      case 'DAILY':
        return daysSinceLastAttempt >= 1;
      case 'EVERY_3_DAYS':
        return daysSinceLastAttempt >= 3;
      case 'WEEKLY':
        return daysSinceLastAttempt >= 7;
      case 'MONTHLY':
        return daysSinceLastAttempt >= 30;
      case 'YEARLY':
        return daysSinceLastAttempt >= 365;
      default:
        return true;
    }
  }

  // PDF Certificate generation
  private async generateCertificatePDF(certificateId: number, data: any) {
    const PDFDocument = require('pdfkit');
    const fs = require('fs');
    const path = require('path');

    const certificatesDir = path.join(__dirname, '..', '..', 'uploads', 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const pdfPath = path.join(certificatesDir, `${data.certificateNo}.pdf`);
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 50 });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Certificate dizayni
    const pageWidth = 842;
    const pageHeight = 595;

    // Border
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60)
       .lineWidth(3)
       .strokeColor('#1a73e8')
       .stroke();

    doc.rect(40, 40, pageWidth - 80, pageHeight - 80)
       .lineWidth(1)
       .strokeColor('#1a73e8')
       .stroke();

    // Header
    doc.fontSize(40)
       .fillColor('#1a73e8')
       .font('Helvetica-Bold')
       .text('CERTIFICATE', 0, 80, { align: 'center' });

    doc.fontSize(16)
       .fillColor('#666')
       .font('Helvetica')
       .text('OF COMPLETION', 0, 135, { align: 'center' });

    // "This is to certify that"
    doc.fontSize(14)
       .fillColor('#333')
       .text('This is to certify that', 0, 190, { align: 'center' });

    // User name
    doc.fontSize(32)
       .fillColor('#1a73e8')
       .font('Helvetica-Bold')
       .text(data.userName, 0, 220, { align: 'center' });

    // "Has successfully completed"
    doc.fontSize(14)
       .fillColor('#333')
       .font('Helvetica')
       .text('has successfully completed', 0, 270, { align: 'center' });

    // Course name
    doc.fontSize(24)
       .fillColor('#333')
       .font('Helvetica-Bold')
       .text(data.courseName, 0, 300, { align: 'center', width: pageWidth });

    // Score
    doc.fontSize(16)
       .fillColor('#555')
       .font('Helvetica')
       .text(
         `with a score of ${data.correctAnswers}/${data.totalQuestions} (${data.score}%)`,
         0,
         345,
         { align: 'center' }
       );

    // Date and Certificate No
    const dateStr = data.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc.fontSize(12)
       .fillColor('#666')
       .text(`Date: ${dateStr}`, 100, 450);

    doc.fontSize(10)
       .fillColor('#999')
       .text(`Certificate No: ${data.certificateNo}`, 100, 470);

    // Teacher signature
    doc.fontSize(12)
       .fillColor('#666')
       .text('_____________________', pageWidth - 300, 430, { width: 200, align: 'center' });

    doc.fontSize(11)
       .fillColor('#333')
       .font('Helvetica-Bold')
       .text(data.teacherName, pageWidth - 300, 455, { width: 200, align: 'center' });

    doc.fontSize(10)
       .fillColor('#666')
       .font('Helvetica')
       .text('Course Instructor', pageWidth - 300, 475, { width: 200, align: 'center' });

    // Footer
    doc.fontSize(9)
       .fillColor('#999')
       .text(
         'Verify this certificate at: https://yourplatform.com/certificates/' + data.certificateNo,
         0,
         pageHeight - 60,
         { align: 'center' }
       );

    doc.end();

    // PDF tugagach URL'ni saqlaymiz
    return new Promise((resolve, reject) => {
      stream.on('finish', async () => {
        const pdfUrl = `/uploads/certificates/${data.certificateNo}.pdf`;
        await this.prisma.certificate.update({
          where: { id: certificateId },
          data: { pdfUrl },
        });
        resolve(pdfUrl);
      });
      stream.on('error', reject);
    });
  }

  async verifyCertificate(certificateNo: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateNo },
      include: {
        user: {
          select: {
            firstName: true,
            surname: true,
          },
        },
        testResult: {
          include: {
            test: {
              include: {
                course: {
                  select: {
                    title: true,
                    teacher: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return {
      valid: true,
      certificateNo: certificate.certificateNo,
      userName: `${certificate.user.firstName || ''} ${certificate.user.surname || ''}`.trim(),
      courseName: certificate.testResult.test.course.title,
      teacherName: certificate.testResult.test.course.teacher?.name,
      score: certificate.testResult.score,
      correctAnswers: certificate.testResult.correctAnswers,
      totalQuestions: certificate.testResult.totalQuestions,
      issuedAt: certificate.issuedAt,
      pdfUrl: certificate.pdfUrl,
    };
  }

  async downloadCertificate(certificateNo: string, res: any) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateNo },
    });

    if (!certificate || !certificate.pdfUrl) {
      throw new NotFoundException('Certificate PDF not found');
    }

    const path = require('path');
    const filePath = path.join(__dirname, '..', '..', certificate.pdfUrl);
    
    return res.download(filePath, `${certificateNo}.pdf`);
  }
}


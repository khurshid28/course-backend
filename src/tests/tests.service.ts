import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.test.findMany({
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            questions: true,
            results: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    return test;
  }

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
        where: { 
          userId, 
          courseId,
          isActive: true // Faqat faol enrollmentlar
        },
      });

      const tests = await this.prisma.test.findMany({
        where: { courseId, isActive: true },
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

          // Debug logging
          console.log(`\n🔍 Test availability check for: ${test.title}`);
          console.log(`   availableAfterDays: ${test.availableAfterDays} (type: ${typeof test.availableAfterDays})`);
          console.log(`   availabilityType: ${test.availabilityType}`);
          console.log(`   enrollment: ${enrollment ? 'YES' : 'NO'}`);

          // Birinchi test (availableAfterDays = 0) barcha userlar uchun ochiq
          // Qolgan testlar faqat kursga yozilganlar uchun
          const isFirstTestFree = Number(test.availableAfterDays) === 0 && String(test.availabilityType).toUpperCase() === 'ANYTIME';
          console.log(`   isFirstTestFree: ${isFirstTestFree}`);

          const isAvailable = isFirstTestFree
            ? true // Birinchi test hamma uchun ochiq
            : enrollment
            ? this.checkTestAvailability(
                test,
                enrollment.enrolledAt,
                lastAttempt?.completedAt,
              )
            : false;

          console.log(`   ✅ isAvailable: ${isAvailable}\n`);

          return {
            ...test,
            lastAttempt,
            isAvailable,
            isEnrolled: !!enrollment, // Qo'shimcha field
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

  async getUserTestResults(userId: number) {
    return this.prisma.testResult.findMany({
      where: { userId },
      include: {
        test: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  async getAllTestResults() {
    return this.prisma.testResult.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
          },
        },
        test: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: 'desc' },
    });
  }

  async getAllCertificates() {
    return this.prisma.certificate.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            surname: true,
            phone: true,
          },
        },
        testResult: {
          include: {
            test: {
              include: {
                course: {
                  select: {
                    id: true,
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
    // Test mavjudligini tekshirish (to'g'ri javoblar bilan)
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Test topilmadi');
    }

    // ========== TEST KALITLARI (TO'G'RI JAVOBLAR) ==========
    console.log('\n');
    console.log('🔑'.repeat(50));
    console.log(`📝 TEST: ${test.title}`);
    console.log(`👤 User ID: ${userId} | ⏱️  ${test.maxDuration} daqiqa | 📊 O'tish: ${test.passingScore}%`);
    console.log('🔑'.repeat(50));
    console.log('\n📋 BARCHA TO\'G\'RI JAVOBLAR (100% UCHUN):');
    console.log('═'.repeat(80));
    
    // Jadval header
    console.log('┌─────┬─────────────────────────────────────────────┬────────────┐');
    console.log('│  №  │              SAVOL                          │  JAVOB     │');
    console.log('├─────┼─────────────────────────────────────────────┼────────────┤');
    
    test.questions.forEach((q, index) => {
      const questionText = q.question.substring(0, 40).padEnd(40);
      const answerNum = q.correctAnswer.toString().padStart(2);
      console.log(`│ ${(index + 1).toString().padStart(3)} │ ${questionText}... │     ${answerNum}     │`);
    });
    
    console.log('└─────┴─────────────────────────────────────────────┴────────────┘');
    console.log('\n💡 100% natija uchun yuqoridagi javoblarni ishlating!\n');
    console.log('═'.repeat(80));
    console.log('\n🎯 REAL-TIME MONITORING:\n');

    // Test'ni frontend uchun qaytarayotganda to'g'ri javoblarni olib tashlaymiz
    const testForFrontend = {
      ...test,
      questions: test.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        order: q.order,
      })),
    };

    // User kursga enrollment qilganmi tekshirish
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId: test.courseId,
        isActive: true,
      },
    });

    // Birinchi test (availableAfterDays = 0 va ANYTIME) hamma uchun ochiq
    const isFirstTestFree = test.availableAfterDays === 0 && test.availabilityType === 'ANYTIME';
    
    if (!enrollment && !isFirstTestFree) {
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
          test: testForFrontend,
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
      test: testForFrontend,
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

    // ========== JAVOB LOG ==========
    const isCorrect = selectedAnswer === question.correctAnswer;
    const status = isCorrect ? '✅ TO\'G\'RI' : '❌ NOTO\'G\'RI';
    const emoji = isCorrect ? '🎉' : '❌';
    
    console.log(`${emoji} Savol #${question.order} | Tanlangan: ${selectedAnswer} | To'g'ri: ${question.correctAnswer} | ${status}`);

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
    
    // minCorrectAnswers ni dinamik hisoblash (test savollari soniga qarab)
    const requiredCorrectAnswers = Math.min(
      session.test.minCorrectAnswers,
      Math.ceil(totalQuestions * 0.7) // Kamida 70% to'g'ri bo'lishi kerak
    );
    
    const shouldGetCertificate = 
      isPassed && 
      correctAnswers >= requiredCorrectAnswers;

    console.log('=== SERTIFIKAT TEKSHIRUVI ===');
    console.log('isPassed:', isPassed);
    console.log('correctAnswers:', correctAnswers);
    console.log('totalQuestions:', totalQuestions);
    console.log('minCorrectAnswers (test config):', session.test.minCorrectAnswers);
    console.log('requiredCorrectAnswers (calculated):', requiredCorrectAnswers);
    console.log('shouldGetCertificate:', shouldGetCertificate);
    console.log('===========================');

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
        testName: session.test.title,
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

    // Use process.cwd() to get project root instead of __dirname
    const certificatesDir = path.join(process.cwd(), 'uploads', 'certificates');
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const pdfPath = path.join(certificatesDir, `${data.certificateNo}.pdf`);
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Certificate dizayni
    const pageWidth = 842;
    const pageHeight = 595;

    // Background gradient effect - light blue to white
    doc.rect(0, 0, pageWidth, 150)
       .fill('#E3F2FD');
    
    doc.rect(0, 150, pageWidth, 200)
       .fill('#F5F5F5');
    
    doc.rect(0, 350, pageWidth, pageHeight - 350)
       .fill('#FAFAFA');

    // Decorative corner elements
    // Top left corner
    doc.circle(0, 0, 80)
       .fill('#1976D2', 0.1);
    
    // Top right corner
    doc.circle(pageWidth, 0, 80)
       .fill('#1976D2', 0.1);
    
    // Bottom left corner
    doc.circle(0, pageHeight, 80)
       .fill('#1976D2', 0.1);
    
    // Bottom right corner
    doc.circle(pageWidth, pageHeight, 80)
       .fill('#1976D2', 0.1);

    // Main border - double line
    doc.rect(25, 25, pageWidth - 50, pageHeight - 50)
       .lineWidth(4)
       .strokeColor('#1976D2')
       .stroke();

    doc.rect(35, 35, pageWidth - 70, pageHeight - 70)
       .lineWidth(1.5)
       .strokeColor('#64B5F6')
       .stroke();

    // Inner decorative line with pattern
    doc.moveTo(60, 165)
       .lineTo(pageWidth - 60, 165)
       .lineWidth(2)
       .strokeColor('#1976D2')
       .stroke();
    
    doc.moveTo(60, 170)
       .lineTo(pageWidth - 60, 170)
       .lineWidth(1)
       .strokeColor('#64B5F6')
       .stroke();

    // Trophy/Award icon using shapes
    const iconX = pageWidth / 2;
    const iconY = 75;
    
    // Trophy base
    doc.circle(iconX, iconY, 20)
       .fill('#FFD700');
    
    // Trophy cup
    doc.polygon([iconX - 15, iconY + 15], [iconX + 15, iconY + 15], [iconX + 10, iconY + 30], [iconX - 10, iconY + 30])
       .fill('#FFB700');
    
    // Star on trophy
    doc.circle(iconX, iconY, 8)
       .fill('#FFF');

    // Header with shadow effect
    doc.fontSize(49)
       .fillColor('#1976D2')
       .font('Helvetica-Bold')
       .text('CERTIFICATE', 0, 108, { align: 'center' });

    doc.fontSize(18)
       .fillColor('#424242')
       .font('Helvetica-Bold')
       .text('OF ACHIEVEMENT', 0, 152, { align: 'center' });

    // Decorative separator line
    doc.moveTo(pageWidth / 2 - 100, 185)
       .lineTo(pageWidth / 2 + 100, 185)
       .lineWidth(2)
       .strokeColor('#1976D2')
       .stroke();

    // "This certifies that" in elegant font
    doc.fontSize(13)
       .fillColor('#616161')
       .font('Helvetica-Oblique')
       .text('This certifies that', 0, 205, { align: 'center' });

    // User name with underline
    const nameY = 230;
    doc.fontSize(36)
       .fillColor('#1976D2')
       .font('Helvetica-Bold')
       .text(data.userName.toUpperCase(), 0, nameY, { align: 'center' });
    
    // Underline for name
    doc.moveTo(pageWidth / 2 - 200, nameY + 45)
       .lineTo(pageWidth / 2 + 200, nameY + 45)
       .lineWidth(2)
       .strokeColor('#64B5F6')
       .stroke();

    // "Has successfully completed" 
    doc.fontSize(13)
       .fillColor('#616161')
       .font('Helvetica')
       .text('has successfully completed the course', 0, 290, { align: 'center' });

    // Course name in box
    doc.roundedRect(pageWidth / 2 - 300, 315, 600, 45, 5)
       .fill('#FFFFFF')
       .stroke('#1976D2');
    
    doc.fontSize(24)
       .fillColor('#1976D2')
       .font('Helvetica-Bold')
       .text(data.courseName, 0, 327, { align: 'center', width: pageWidth });

    // Score badge
    const badgeX = pageWidth / 2;
    const badgeY = 390;
    
    doc.circle(badgeX, badgeY, 35)
       .fill('#4CAF50');
    
    doc.fontSize(26)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text(`${data.score}%`, 0, badgeY - 13, { width: pageWidth, align: 'center' });
    
    doc.fontSize(12)
       .fillColor('#616161')
       .font('Helvetica')
       .text(`Score: ${data.correctAnswers}/${data.totalQuestions} correct answers`, 0, 432, { align: 'center' });
    
    // Test name
    doc.fontSize(11)
       .fillColor('#9E9E9E')
       .font('Helvetica-Oblique')
       .text(`Test: ${data.testName || 'Course Assessment'}`, 0, 452, { align: 'center' });

    // Date and Certificate No in styled boxes
    const dateString = data.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // Left side - Date
    const leftBoxX = 80;
    const boxY = 485;
    
    doc.roundedRect(leftBoxX, boxY, 180, 50, 3)
       .lineWidth(1)
       .strokeColor('#1976D2')
       .stroke();
    
    doc.fontSize(10)
       .fillColor('#757575')
       .font('Helvetica')
       .text('Issue Date', leftBoxX, boxY + 10, { width: 180, align: 'center' });
    
    doc.fontSize(12)
       .fillColor('#1976D2')
       .font('Helvetica-Bold')
       .text(dateString, leftBoxX, boxY + 27, { width: 180, align: 'center' });

    // Right side - Teacher signature
    const rightBoxX = pageWidth - 260;
    
    doc.roundedRect(rightBoxX, boxY, 180, 50, 3)
       .lineWidth(1)
       .strokeColor('#1976D2')
       .stroke();
    
    // Signature line
    doc.moveTo(rightBoxX + 30, boxY + 30)
       .lineTo(rightBoxX + 150, boxY + 30)
       .lineWidth(1)
       .strokeColor('#1976D2')
       .stroke();
    
    doc.fontSize(10)
       .fillColor('#757575')
       .font('Helvetica')
       .text('Authorized By', rightBoxX, boxY + 10, { width: 180, align: 'center' });
    
    doc.fontSize(11)
       .fillColor('#1976D2')
       .font('Helvetica-Bold')
       .text(data.teacherName, rightBoxX, boxY + 35, { width: 180, align: 'center' });

    // Certificate number at bottom
    doc.fontSize(9)
       .fillColor('#9E9E9E')
       .font('Helvetica')
       .text(`Certificate ID: ${data.certificateNo}`, 0, pageHeight - 45, { align: 'center' });

    // Watermark text - amber colored
    doc.save();
    doc.rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] });
    doc.fontSize(80)
       .fillColor('#FFA726')
       .fillOpacity(0.15)
       .font('Helvetica-Bold')
       .text('VERIFIED', pageWidth / 2 - 200, pageHeight / 2 - 40, { width: 400, align: 'center' });
    doc.restore();

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
    const fs = require('fs');
    const path = require('path');
    
    const certificate = await this.prisma.certificate.findUnique({
      where: { certificateNo },
      include: {
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
            user: {
              select: {
                firstName: true,
                surname: true,
              },
            },
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Agar PDF mavjud bo'lmasa yoki file yo'q bo'lsa, generate qilamiz
    let filePath = certificate.pdfUrl ? path.join(process.cwd(), certificate.pdfUrl) : null;
    
    if (!filePath || !fs.existsSync(filePath)) {
      console.log('📄 PDF topilmadi, generatsiya qilinmoqda...');
      
      // PDF yaratish
      const pdfUrl = await this.generateCertificatePDF(certificate.id, {
        certificateNo: certificate.certificateNo,
        userName: `${certificate.testResult.user.firstName || ''} ${certificate.testResult.user.surname || ''}`.trim() || 'User',
        courseName: certificate.testResult.test.course.title,
        teacherName: certificate.testResult.test.course.teacher?.name || 'Teacher',
        testName: certificate.testResult.test.title,
        score: certificate.testResult.score,
        correctAnswers: certificate.testResult.correctAnswers,
        totalQuestions: certificate.testResult.totalQuestions,
        date: certificate.testResult.completedAt || new Date(),
      });
      
      filePath = path.join(process.cwd(), pdfUrl);
      console.log('✅ PDF muvaffaqiyatli yaratildi:', filePath);
    }
    
    return res.download(filePath, `${certificateNo}.pdf`);
  }
}


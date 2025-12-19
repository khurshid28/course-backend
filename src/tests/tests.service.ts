import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';
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

  async findByCourseId(courseId: number) {
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
}

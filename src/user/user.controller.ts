import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  @Get('certificates')
  async getUserCertificates(@GetUser() user: any) {
    const userId = user.userId;

    const certificates = await this.prisma.certificate.findMany({
      where: { userId },
      include: {
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
        user: {
          select: {
            firstName: true,
            surname: true,
            email: true,
          },
        },
      },
      orderBy: {
        issuedAt: 'desc',
      },
    });

    // Format user name
    return certificates.map(cert => ({
      ...cert,
      user: {
        ...cert.user,
        fullName: `${cert.user.firstName || ''} ${cert.user.surname || ''}`.trim(),
      },
    }));
  }
}

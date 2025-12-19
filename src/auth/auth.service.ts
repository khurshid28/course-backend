import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SendCodeDto, VerifyCodeDto, CompleteProfileDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async sendCode(dto: SendCodeDto) {
    const { phone } = dto;
    
    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { phone } });
    
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone },
      });
    }

    // Delete old codes for this user
    await this.prisma.verificationCode.deleteMany({
      where: { userId: user.id },
    });

    // Create verification code (test: 666666)
    const code = '666666';
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    await this.prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // TODO: Send SMS via provider (for now, return code in development)
    return {
      message: 'Verification code sent',
      phone,
      code: process.env.NODE_ENV === 'development' ? code : undefined,
      expiresIn: 120, // seconds
    };
  }

  async verifyCode(dto: VerifyCodeDto) {
    const { phone, code } = dto;

    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const verificationCode = await this.prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verificationCode) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Mark code as used
    await this.prisma.verificationCode.update({
      where: { id: verificationCode.id },
      data: { isUsed: true },
    });

    // Update user as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Check if profile is complete
    const isProfileComplete = !!(user.firstName && user.surname && user.gender && user.region);

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        gender: user.gender,
        region: user.region,
      },
      isProfileComplete,
    };
  }

  async completeProfile(userId: number, dto: CompleteProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: dto.firstName,
        surname: dto.surname,
        email: dto.email,
        gender: dto.gender as any,
        region: dto.region as any,
        avatar: dto.avatar,
      },
    });

    const token = this.generateToken(user.id);

    return {
      token,
      user: {
        id: user.id,
        phone: user.phone,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
        gender: user.gender,
        region: user.region,
        avatar: user.avatar,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        firstName: true,
        surname: true,
        gender: true,
        region: true,
        avatar: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private generateToken(userId: number): string {
    return this.jwtService.sign({ userId });
  }
}

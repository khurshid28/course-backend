import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { userId?: number; sub?: number; role?: string }) {
    // Support both userId (user/admin login) and sub (admin login)
    const id = payload.userId || payload.sub;
    
    if (!id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Check if this is an admin token
    if (payload.role) {
      // Admin token - validate in Admin table
      const admin = await this.prisma.admin.findUnique({
        where: { id },
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Admin not found or inactive');
      }

      return { ...admin, isAdmin: true };
    }

    // User token - validate in User table
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return { ...user, isAdmin: false };
  }
}

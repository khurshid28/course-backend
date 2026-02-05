import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromoCodeService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.promoCode.findMany({
      include: {
        _count: {
          select: {
            usages: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { id },
      include: {
        usages: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                surname: true,
                phone: true,
              },
            },
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!promoCode) {
      throw new NotFoundException(`PromoCode #${id} not found`);
    }

    return promoCode;
  }

  async create(data: any) {
    return this.prisma.promoCode.create({
      data,
    });
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.promoCode.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.promoCode.delete({ where: { id } });
    return { message: 'PromoCode deleted successfully' };
  }

  async validatePromoCode(code: string, userId: number, courseId: number) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { code },
      include: {
        usages: {
          where: { userId },
        },
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Promo kod topilmadi');
    }

    if (!promoCode.isActive) {
      throw new BadRequestException('Promo kod faol emas');
    }

    if (promoCode.expiresAt && new Date(promoCode.expiresAt) < new Date()) {
      throw new BadRequestException('Promo kod muddati tugagan');
    }

    if (promoCode.type === 'SINGLE_USE' && promoCode.currentUsageCount >= (promoCode.maxUsageCount || 1)) {
      throw new BadRequestException('Promo kod ishlatilgan');
    }

    if (promoCode.type === 'USER_SINGLE_USE' && promoCode.usages.length > 0) {
      throw new BadRequestException('Siz bu promo kodni allaqachon ishlatgansiz');
    }

    return {
      valid: true,
      promoCode,
      discountPercent: promoCode.discountPercent,
      discountAmount: promoCode.discountAmount,
    };
  }
}

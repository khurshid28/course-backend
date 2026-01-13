import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { TopupBalanceDto } from './dto/topup-balance.dto';
import { ValidatePromoCodeDto } from './dto/promo-code.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post()
  createPayment(@GetUser('id') userId: number, @Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(userId, dto);
  }

  @Post(':id/confirm')
  confirmPayment(@Param('id', ParseIntPipe) paymentId: number) {
    return this.paymentService.confirmPayment(paymentId);
  }

  @Get('history')
  getPaymentHistory(@GetUser('id') userId: number) {
    return this.paymentService.getPaymentHistory(userId);
  }

  @Post('topup')
  topupBalance(@GetUser('id') userId: number, @Body() dto: TopupBalanceDto) {
    return this.paymentService.topupBalance(userId, dto.amount, dto.method);
  }

  @Get('balance')
  getBalance(@GetUser('id') userId: number) {
    return this.paymentService.getUserBalance(userId);
  }

  @Post('promo/validate')
  validatePromoCode(@GetUser('id') userId: number, @Body() dto: ValidatePromoCodeDto) {
    return this.paymentService.validatePromoCode(userId, dto.code, dto.courseId);
  }

  @Get('promo/usage-count')
  getPromoCodeUsageCount(@GetUser('id') userId: number) {
    return this.paymentService.getUserPromoCodeUsageCount(userId);
  }

  @Get('promo/used')
  getUserUsedPromoCodes(@GetUser('id') userId: number) {
    return this.paymentService.getUserUsedPromoCodes(userId);
  }
}

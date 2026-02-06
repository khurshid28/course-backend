import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards, Query, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { TopupBalanceDto } from './dto/topup-balance.dto';
import { ValidatePromoCodeDto } from './dto/promo-code.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuard as AdminJwtAuthGuard } from '../admin/guards/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Admin endpoints
  @Get()
  @UseGuards(AdminJwtAuthGuard)
  getAllPayments(@Query('status') status?: string) {
    return this.paymentService.getAllPayments(status);
  }

  @Delete(':id')
  @UseGuards(AdminJwtAuthGuard)
  deletePayment(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.deletePayment(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createPayment(@GetUser('id') userId: number, @Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(userId, dto);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard)
  confirmPayment(@Param('id', ParseIntPipe) paymentId: number) {
    return this.paymentService.confirmPayment(paymentId);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  getPaymentHistory(@GetUser('id') userId: number) {
    return this.paymentService.getPaymentHistory(userId);
  }

  @Post('topup')
  @UseGuards(JwtAuthGuard)
  topupBalance(@GetUser('id') userId: number, @Body() dto: TopupBalanceDto) {
    return this.paymentService.topupBalance(userId, dto.amount, dto.method);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  getBalance(@GetUser('id') userId: number) {
    return this.paymentService.getUserBalance(userId);
  }

  @Post('promo/validate')
  @UseGuards(JwtAuthGuard)
  validatePromoCode(@GetUser('id') userId: number, @Body() dto: ValidatePromoCodeDto) {
    return this.paymentService.validatePromoCode(userId, dto.code, dto.courseId);
  }

  @Get('promo/usage-count')
  @UseGuards(JwtAuthGuard)
  getPromoCodeUsageCount(@GetUser('id') userId: number) {
    return this.paymentService.getUserPromoCodeUsageCount(userId);
  }

  @Get('promo/used')
  @UseGuards(JwtAuthGuard)
  getUserUsedPromoCodes(@GetUser('id') userId: number) {
    return this.paymentService.getUserUsedPromoCodes(userId);
  }
}

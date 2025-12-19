import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';
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
}

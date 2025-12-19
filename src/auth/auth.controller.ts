import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendCodeDto, VerifyCodeDto, CompleteProfileDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('send-code')
  sendCode(@Body() dto: SendCodeDto) {
    return this.authService.sendCode(dto);
  }

  @Post('verify-code')
  verifyCode(@Body() dto: VerifyCodeDto) {
    return this.authService.verifyCode(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('complete-profile')
  completeProfile(@GetUser('id') userId: number, @Body() dto: CompleteProfileDto) {
    return this.authService.completeProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUser('id') userId: number) {
    return this.authService.getProfile(userId);
  }
}

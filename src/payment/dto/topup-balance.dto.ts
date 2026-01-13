import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class TopupBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(['CLICK', 'PAYME', 'UZUM'], {
    message: 'Payment method must be CLICK, PAYME, or UZUM for balance topup',
  })
  method: 'CLICK' | 'PAYME' | 'UZUM';
}

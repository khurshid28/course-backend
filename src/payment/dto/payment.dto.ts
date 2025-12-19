import { IsNotEmpty, IsInt, IsNumber, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsInt()
  courseId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(['CLICK', 'PAYME', 'UZUM'])
  method: 'CLICK' | 'PAYME' | 'UZUM';
}

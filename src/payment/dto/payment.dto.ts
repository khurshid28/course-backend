import { IsNotEmpty, IsInt, IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsInt()
  courseId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsEnum(['CLICK', 'PAYME', 'UZUM', 'BALANCE'])
  method: 'CLICK' | 'PAYME' | 'UZUM' | 'BALANCE';

  @IsOptional()
  @IsString()
  promoCode?: string;
}

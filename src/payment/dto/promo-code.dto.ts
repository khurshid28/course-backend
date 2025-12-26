import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class ValidatePromoCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

export class ApplyPromoCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsInt()
  @IsNotEmpty()
  courseId: number;
}

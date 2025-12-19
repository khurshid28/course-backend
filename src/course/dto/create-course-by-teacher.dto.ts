import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsArray, IsOptional, Min } from 'class-validator';

export class CreateCourseByTeacherDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  categoryId: number;

  @IsOptional()
  @IsArray()
  categoryIds?: number[];

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;
}

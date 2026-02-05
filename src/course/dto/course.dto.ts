import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsInt()
  teacherId: number;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  freeVideosCount?: number;

  @IsOptional()
  @IsString()
  level?: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsInt()
  teacherId?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  freeVideosCount?: number;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateFeedbackDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

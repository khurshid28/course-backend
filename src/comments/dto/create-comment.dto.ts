import { IsNotEmpty, IsNumber, IsString, Min, Max, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  courseId: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating: number;

  @IsOptional()
  @IsArray()
  screenshots?: string[];
}

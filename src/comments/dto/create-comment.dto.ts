import { IsNotEmpty, IsNumber, IsString, Min, Max, IsOptional, IsArray } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsArray()
  screenshots?: string[];
}

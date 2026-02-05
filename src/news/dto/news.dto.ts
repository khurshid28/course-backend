import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsBoolean()
  isPublished: boolean;

  @IsOptional()
  @IsInt()
  authorId?: number;
}

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateVideoCommentDto {
  @IsInt()
  userId: number;

  @IsInt()
  videoId: number;

  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  images?: string;
}

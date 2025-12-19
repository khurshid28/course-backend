import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class SubmitTestDto {
  @IsNotEmpty()
  @IsNumber()
  testId: number;

  @IsNotEmpty()
  @IsArray()
  answers: { questionId: number; answer: number }[];
}

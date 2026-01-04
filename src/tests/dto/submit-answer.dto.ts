import { IsInt, IsNotEmpty } from 'class-validator';

export class SubmitAnswerDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number;

  @IsInt()
  @IsNotEmpty()
  selectedAnswer: number;
}

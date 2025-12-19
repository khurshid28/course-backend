export class UpdateTestDto {
  title?: string;
  description?: string;
  duration?: number;
  passingScore?: number;
  isActive?: boolean;
  questions?: UpdateQuestionDto[];
}

export class UpdateQuestionDto {
  id?: number; // if updating existing question
  question: string;
  options: string[];
  correctAnswer: number;
  order: number;
}

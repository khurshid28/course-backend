export class CreateTestDto {
  courseId: number;
  title: string;
  description?: string;
  duration: number; // in minutes
  passingScore: number; // percentage
  questions: CreateQuestionDto[];
}

export class CreateQuestionDto {
  question: string;
  options: string[]; // array of options
  correctAnswer: number; // index of correct option
  order: number;
}

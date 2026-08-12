import { TriviaApiQuestion } from "@/src/lib/schemas/trivia";

export interface Questions {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: string;
  category: string;
  difficulty: TriviaApiQuestion["difficulty"];
}

import { TriviaApiQuestion } from "../api/TriviaApiQuestion";

export interface Questions {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: string;
  category: string;
  difficulty: TriviaApiQuestion["difficulty"];
}

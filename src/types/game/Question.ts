import { TriviaApiQuestion } from "@/src/lib/schemas/trivia";

export type Questions = {
  id: number;
  text: string;
  choices: string[];
  correctAnswer: string;
  category: string;
  difficulty: TriviaApiQuestion["difficulty"];
};

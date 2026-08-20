import { TriviaApiQuestion } from "@/src/lib/schemas/trivia";

export type Questions = {
  id: string;
  text: string;
  choices: string[];
  correctAnswer: string;
  category: string;
  difficulty: TriviaApiQuestion["difficulty"];
  imageUrl?: string | null;
};

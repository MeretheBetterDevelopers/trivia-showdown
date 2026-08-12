import { z } from "zod";

export const triviaApiQuestionSchema = z.object({
  type: z.enum(["multiple", "boolean"]),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string(),
  question: z.string(),
  correct_answer: z.string(),
  incorrect_answers: z.array(z.string()),
});

export type TriviaApiQuestion = z.infer<typeof triviaApiQuestionSchema>;

export const triviaApiResponseSchema = z.object({
  response_code: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  results: z.array(triviaApiQuestionSchema),
});

export type TriviaApiResponse = z.infer<typeof triviaApiResponseSchema>;

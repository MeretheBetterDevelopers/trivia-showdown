import { z } from "zod";

export const questionSchema = z
  .object({
    text: z.string().min(1, "Question text is required"),
    choices: z
      .array(z.string().min(1, "Choice can't be empty"))
      .length(4, "Exactly 4 choices are required"),
    correctAnswer: z.string().min(1, "Select the correct answer"),
    category: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
  })
  .refine((data) => data.choices.includes(data.correctAnswer), {
    message: "Correct answer must be one of the choices",
    path: ["correctAnswer"],
  });

export type QuestionInput = z.infer<typeof questionSchema>;

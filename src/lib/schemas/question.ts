import { z } from "zod";

export const questionSchema = z
  .object({
    text: z.string().min(1, "Question text is required"),
    choices: z
      .array(z.string().min(1, "Choice can't be empty"))
      .length(4, "Exactly 4 choices are required"),
    correctAnswerIndex: z.preprocess(
      (val) => (typeof val === "string" && val !== "" ? Number(val) : val),
      z.number("Select the correct answer").min(0).max(3),
    ),
    category: z.string().optional(),
    difficulty: z.enum(["easy", "medium", "hard"]),
    imageUrl: z.string().url("Invalid image URL").nullish(),
  })
  .refine((data) => new Set(data.choices).size === data.choices.length, {
    message: "Two answers can't be the same — each choice must be unique",
    path: ["choices"],
  });

export type QuestionInput = z.infer<typeof questionSchema>;

export type QuestionFormValues = z.input<typeof questionSchema>;

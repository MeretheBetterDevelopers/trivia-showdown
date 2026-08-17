"use server";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { questionSchema } from "@/src/lib/schemas/question";

type CreateQuestionState = { error: string | null };

export async function createQuestion(
  prevState: CreateQuestionState,
  formData: FormData,
): Promise<CreateQuestionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authorized" };
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (currentUser?.role !== "ADMIN") {
    return { error: "Not authorized" };
  }

  const choices = formData.getAll("choices").map(String);
  const correctAnswerIndex = Number(formData.get("correctAnswerIndex"));

  const result = questionSchema.safeParse({
    text: formData.get("text"),
    choices,
    correctAnswer: choices[correctAnswerIndex],
    category: formData.get("category") || undefined,
    difficulty: formData.get("difficulty"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid question" };
  }

  const { text, choices: validChoices, correctAnswer, category, difficulty } =
    result.data;

  await prisma.question.create({
    data: {
      text,
      choices: validChoices,
      correctAnswer,
      category,
      difficulty,
      createdBy: session.user.id,
    },
  });

  revalidatePath("/trivia/admin/questions");
  return { error: null };
}

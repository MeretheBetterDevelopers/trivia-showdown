"use server";
import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { questionSchema } from "@/src/lib/schemas/question";
import { deleteCloudinaryImage } from "@/src/lib/actions/deleteCloudinaryImage";

type CreateQuestionState = { error: string | null };

export async function createQuestion(
  prevState: CreateQuestionState,
  formData: FormData,
): Promise<CreateQuestionState> {
  const admin = await getCurrentUserIfAdmin();
  if (!admin) {
    return { error: "Not authorized" };
  }

  const rawImageUrl = formData.get("imageUrl");

  const result = questionSchema.safeParse({
    text: formData.get("text"),
    choices: formData.getAll("choices").map(String),
    correctAnswerIndex: Number(formData.get("correctAnswerIndex")),
    category: formData.get("category") || undefined,
    difficulty: formData.get("difficulty"),
    imageUrl: rawImageUrl,
  });

  if (!result.success) {
    if (typeof rawImageUrl === "string" && rawImageUrl) {
      try {
        await deleteCloudinaryImage(rawImageUrl);
      } catch (error) {
        console.error("Failed to delete Cloudinary image:", error);
      }
    }
    return { error: result.error.issues[0]?.message ?? "Invalid question" };
  }

  const {
    text,
    choices: validChoices,
    correctAnswerIndex,
    category,
    difficulty,
    imageUrl,
  } = result.data;

  await prisma.question.create({
    data: {
      text,
      choices: validChoices,
      correctAnswer: validChoices[correctAnswerIndex],
      category,
      difficulty,
      imageUrl,
      createdBy: admin.id,
    },
  });

  revalidatePath("/trivia/admin/questions");
  return { error: null };
}

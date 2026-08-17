"use server";

import { getCurrentAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(questionId: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Not authorized");
  }

  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath("/trivia/admin/questions");
}

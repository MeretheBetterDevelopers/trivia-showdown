"use server";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteQuestion(questionId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authorized");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  if (currentUser?.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  await prisma.question.delete({ where: { id: questionId } });
  revalidatePath("/trivia/admin/questions");
}

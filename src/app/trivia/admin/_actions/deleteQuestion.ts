"use server";

import { getCurrentAdmin } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "@/src/lib/actions/deleteCloudinaryImage";

export async function deleteQuestion(questionId: string) {
  const isAdmin = await getCurrentAdmin();
  if (!isAdmin) {
    throw new Error("Not authorized");
  }

  const deleted = await prisma.question.delete({ where: { id: questionId } });

  if (deleted.imageUrl) {
    try {
      await deleteCloudinaryImage(deleted.imageUrl);
    } catch (error) {
      console.error("Failed to delete Cloudinary image:", error);
    }
  }

  revalidatePath("/trivia/admin/questions");
}

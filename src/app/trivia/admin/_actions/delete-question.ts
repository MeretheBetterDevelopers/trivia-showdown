"use server";

import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteCloudinaryImage } from "@/src/lib/actions/delete-cloudinary-image";

export async function deleteQuestion(questionId: string) {
  const isAdmin = await getCurrentUserIfAdmin();
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

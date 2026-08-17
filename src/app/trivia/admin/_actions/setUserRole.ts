"use server";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@/src/generated/prisma/enums";

export async function setUserRole(userId: string, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  const role = formData.get("role") as Role;

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/trivia/admin/users");
}

"use server";

import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@/src/generated/prisma/enums";

export async function setUserRole(userId: string, role: Role) {
  const admin = await getCurrentUserIfAdmin();
  if (!admin) {
    throw new Error("Not authorized");
  }
  if (userId === admin.id) {
    throw new Error("Not authorized");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/trivia/admin/users");
}

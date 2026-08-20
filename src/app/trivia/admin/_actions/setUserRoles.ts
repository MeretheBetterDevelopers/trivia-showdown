"use server";

import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@/src/generated/prisma/enums";

const ROLE_FIELD_PREFIX = "role-";

export async function setUserRoles(formData: FormData) {
  const admin = await getCurrentUserIfAdmin();
  if (!admin) {
    throw new Error("Not authorized");
  }

  const updatedRoles = Array.from(formData.entries())
    .filter(([key]) => key.startsWith(ROLE_FIELD_PREFIX))
    .map(([key, value]) => ({
      userId: key.slice(ROLE_FIELD_PREFIX.length),
      role: value as Role,
    }))
    .filter(({ userId }) => userId !== admin.id)
    .map(({ userId, role }) =>
      prisma.user.update({ where: { id: userId }, data: { role } }),
    );

  await Promise.all(updatedRoles);
  revalidatePath("/trivia/admin/users");
}

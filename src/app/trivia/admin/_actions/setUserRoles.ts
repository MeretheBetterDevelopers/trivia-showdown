"use server";

import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Role } from "@/src/generated/prisma/enums";

const ROLE_FIELD_PREFIX = "role-";

export async function setUserRoles(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Not authorized");
  }

  const updates = Array.from(formData.entries())
    .filter(([key]) => key.startsWith(ROLE_FIELD_PREFIX))
    .map(([key, value]) =>
      prisma.user.update({
        where: { id: key.slice(ROLE_FIELD_PREFIX.length) },
        data: { role: value as Role },
      }),
    );

  await Promise.all(updates);
  revalidatePath("/trivia/admin/users");
}

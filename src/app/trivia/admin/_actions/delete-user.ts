"use server";

import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const admin = await getCurrentUserIfAdmin();
  if (!admin) {
    throw new Error("Not authorized");
  }

  await auth.api.removeUser({
    body: { userId },
    headers: await headers(),
  });

  revalidatePath("/trivia/admin/users");
}

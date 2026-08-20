"use server";

import { getCurrentUserIfAdmin } from "@/src/lib/roles";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export async function resetUserPassword(userId: string, newPassword: string) {
  const admin = await getCurrentUserIfAdmin();
  if (!admin) {
    throw new Error("Not authorized");
  }

  await auth.api.setUserPassword({
    body: { userId, newPassword },
    headers: await headers(),
  });
}

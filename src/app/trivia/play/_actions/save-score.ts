"use server";

import { getCurrentSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveScore(score: number, total: number) {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }

  await prisma.leaderboardEntry.create({
    data: {
      userId: session.user.id,
      score,
      total,
    },
  });

  revalidatePath("/trivia/leaderboard");
}

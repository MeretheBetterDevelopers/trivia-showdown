"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { getCurrentSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { Answer } from "@/src/types/game/answer";

export async function resumeDailyRound(
  roundId: string,
): Promise<{ answers: Answer[] }> {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }
  const userId = session.user.id;

  const existing = await prisma.leaderboardEntry.findUnique({
    where: { userId_roundId: { userId, roundId } },
  });
  if (!existing || existing.completed) {
    return { answers: (existing?.answers as unknown as Answer[]) ?? [] };
  }

  const priorAnswers = existing.answers as unknown as Answer[];
  const answers: Answer[] = [
    ...priorAnswers,
    { index: priorAnswers.length, choice: null, correct: false },
  ];
  const score = answers.filter((answer) => answer.correct).length;

  await prisma.leaderboardEntry.update({
    where: { userId_roundId: { userId, roundId } },
    data: { answers: answers as unknown as Prisma.InputJsonValue, score },
  });

  return { answers };
}

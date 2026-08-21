"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { getCurrentSession } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { revalidatePath } from "next/cache";
import { Answer } from "@/src/types/game/answer";
import { Questions } from "@/src/types/game/question";

export async function saveDailyAnswer(
  roundId: string,
  index: number,
  choice: string | null,
  isCorrect: boolean,
) {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    throw new Error("Not signed in");
  }
  const userId = session.user.id;

  const round = await prisma.round.findUniqueOrThrow({
    where: { id: roundId },
  });
  const total = (round.questions as unknown as Questions[]).length;

  const existing = await prisma.leaderboardEntry.findUnique({
    where: { userId_roundId: { userId, roundId } },
  });
  const priorAnswers =
    (existing?.answers as unknown as Answer[] | undefined) ?? [];

  const answers: Answer[] = [
    ...priorAnswers.filter((answer) => answer.index !== index),
    { index, choice, correct: isCorrect },
  ];
  const score = answers.filter((answer) => answer.correct).length;
  const completed = answers.length >= total;

  await prisma.leaderboardEntry.upsert({
    where: { userId_roundId: { userId, roundId } },
    create: {
      userId,
      roundId,
      score,
      total,
      answers: answers as unknown as Prisma.InputJsonValue,
      completed,
    },
    update: {
      score,
      total,
      answers: answers as unknown as Prisma.InputJsonValue,
      completed,
    },
  });

  if (completed) {
    revalidatePath("/trivia/leaderboard");
  }
}

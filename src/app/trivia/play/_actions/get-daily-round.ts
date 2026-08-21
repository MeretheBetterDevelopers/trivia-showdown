"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { getRoundQuestions } from "./get-round-questions";
import { DAILY_QUESTION_COUNT } from "@/src/lib/constants/game";
import { getCurrentSession } from "@/src/lib/auth";
import { getUTCDayWindow } from "@/src/lib/helpers/date-window";
import { prisma } from "@/src/lib/prisma";
import { Answer } from "@/src/types/game/answer";
import { Questions } from "@/src/types/game/question";

export async function getDailyRound(): Promise<{
  roundId: string;
  questions: Questions[];
  progress: { answers: Answer[]; score: number; completed: boolean } | null;
}> {
  const { opensAt, closesAt } = getUTCDayWindow();
  const session = await getCurrentSession();

  const existing = await prisma.round.findFirst({
    where: { mode: "DAILY", opensAt },
  });
  if (existing) {
    const progress = session?.user?.id
      ? await getProgress(session.user.id, existing.id)
      : null;
    return {
      roundId: existing.id,
      questions: existing.questions as unknown as Questions[],
      progress,
    };
  }

  const questions = await getRoundQuestions(DAILY_QUESTION_COUNT, []);

  const round = await prisma.round.create({
    data: {
      mode: "DAILY",
      questions: questions as unknown as Prisma.InputJsonValue,
      opensAt,
      closesAt,
    },
  });

  return { roundId: round.id, questions, progress: null };
}

async function getProgress(userId: string, roundId: string) {
  const entry = await prisma.leaderboardEntry.findUnique({
    where: { userId_roundId: { userId, roundId } },
  });
  if (!entry) return null;

  return {
    answers: entry.answers as unknown as Answer[],
    score: entry.score,
    completed: entry.completed,
  };
}

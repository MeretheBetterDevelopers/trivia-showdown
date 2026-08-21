"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { getRoundQuestions } from "./get-round-questions";
import {
  DAILY_QUESTION_COUNT,
  MONTHLY_QUESTION_COUNT,
  WEEKLY_QUESTION_COUNT,
} from "@/src/lib/constants/game";
import { getCurrentSession } from "@/src/lib/auth";
import {
  getUTCDayWindow,
  getUTCMonthWindow,
  getUTCWeekWindow,
} from "@/src/lib/helpers/date-window";
import { prisma } from "@/src/lib/prisma";
import { Answer } from "@/src/types/game/answer";
import { Questions } from "@/src/types/game/question";

export type ScheduledRoundMode = "DAILY" | "WEEKLY" | "MONTHLY";

const ROUND_CONFIG: Record<
  ScheduledRoundMode,
  {
    window: (date?: Date) => { opensAt: Date; closesAt: Date };
    questionCount: number;
  }
> = {
  DAILY: { window: getUTCDayWindow, questionCount: DAILY_QUESTION_COUNT },
  WEEKLY: { window: getUTCWeekWindow, questionCount: WEEKLY_QUESTION_COUNT },
  MONTHLY: {
    window: getUTCMonthWindow,
    questionCount: MONTHLY_QUESTION_COUNT,
  },
};

export async function getRound(mode: ScheduledRoundMode): Promise<{
  roundId: string;
  questions: Questions[];
  progress: { answers: Answer[]; score: number; completed: boolean } | null;
}> {
  const { window, questionCount } = ROUND_CONFIG[mode];
  const { opensAt, closesAt } = window();
  const session = await getCurrentSession();

  const existing = await prisma.round.findFirst({
    where: { mode, opensAt },
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

  // No category filter, any difficulty - same round for everyone, per
  // #22's "Why" (a shared moment, not a personalized mix).
  const questions = await getRoundQuestions(questionCount, []);

  // Two players racing to create this period's first round both landing
  // here is an accepted edge case for this slice - worst case is a
  // harmless duplicate Round row, not incorrect gameplay, so no
  // locking/upsert.
  const round = await prisma.round.create({
    data: {
      mode,
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

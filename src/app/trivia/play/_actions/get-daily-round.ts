"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { getRoundQuestions } from "./get-round-questions";
import { DAILY_QUESTION_COUNT } from "@/src/lib/constants/game";
import { getUTCDayWindow } from "@/src/lib/helpers/date-window";
import { prisma } from "@/src/lib/prisma";
import { Questions } from "@/src/types/game/question";

export async function getDailyRound(): Promise<{
  roundId: string;
  questions: Questions[];
}> {
  const { opensAt, closesAt } = getUTCDayWindow();

  const existing = await prisma.round.findFirst({
    where: { mode: "DAILY", opensAt },
  });
  if (existing) {
    return {
      roundId: existing.id,
      questions: existing.questions as unknown as Questions[],
    };
  }

  // No category filter, any difficulty - same round for everyone, per
  // #22's "Why" (a shared moment, not a personalized mix).
  const questions = await getRoundQuestions(DAILY_QUESTION_COUNT, []);

  // Two players racing to create today's first round both landing here
  // is an accepted edge case for this slice - worst case is a harmless
  // duplicate Round row, not incorrect gameplay, so no locking/upsert.
  const round = await prisma.round.create({
    data: {
      mode: "DAILY",
      questions: questions as unknown as Prisma.InputJsonValue,
      opensAt,
      closesAt,
    },
  });

  return { roundId: round.id, questions };
}

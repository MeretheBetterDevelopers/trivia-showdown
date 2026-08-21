"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { getRoundQuestions } from "./get-round-questions";
import { DAILY_QUESTION_COUNT } from "@/src/lib/constants/game";
import { prisma } from "@/src/lib/prisma";
import { Questions } from "@/src/types/game/question";

// Today's UTC calendar day. A simplification for this first slice -
// "today" doesn't follow each player's own timezone, so someone far
// from UTC could see the round flip over at a locally odd hour.
function getTodayWindow(): { opensAt: Date; closesAt: Date } {
  const now = new Date();
  const opensAt = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const closesAt = new Date(opensAt);
  closesAt.setUTCDate(closesAt.getUTCDate() + 1);
  return { opensAt, closesAt };
}

export async function getDailyRound(): Promise<{
  roundId: string;
  questions: Questions[];
}> {
  const { opensAt, closesAt } = getTodayWindow();

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

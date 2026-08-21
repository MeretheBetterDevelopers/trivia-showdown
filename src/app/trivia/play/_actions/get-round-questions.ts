"use server";

import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import categories from "@/src/lib/constants/categories.json";
import { copy } from "@/src/lib/constants/copy";
import { OTDB_RATE_LIMIT_DELAY_MS } from "@/src/lib/constants/game";
import { shuffle } from "@/src/lib/helpers/shuffle-items";
import { prisma } from "@/src/lib/prisma";
import { Questions } from "@/src/types/game/question";
import { Difficulty } from "@/src/generated/prisma/enums";

const OTDB_CATEGORY_IDS: Record<string, number> = Object.fromEntries(
  categories.trivia_categories
    .filter((category) => category.name !== "Better Developers")
    .map((category) => [category.name, category.id]),
);

const MAX_OTDB_CATEGORIES_PER_ROUND = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pickOtdbCategoryIds(names: string[]): number[] {
  const ids = names
    .map((name) => OTDB_CATEGORY_IDS[name])
    .filter((id): id is number => id !== undefined);
  return shuffle(ids).slice(0, MAX_OTDB_CATEGORIES_PER_ROUND);
}

function shuffleOtdbCategoryIds(names: string[]): number[] {
  const ids = names
    .map((name) => OTDB_CATEGORY_IDS[name])
    .filter((id): id is number => id !== undefined);
  return shuffle(ids);
}

function distributeCounts(total: number, count: number): number[] {
  if (count <= 0) return [];
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  const amounts = Array(count).fill(base) as number[];
  const bonusIndices = shuffle(
    Array.from({ length: count }, (_, i) => i),
  ).slice(0, remainder);
  for (const index of bonusIndices) amounts[index] += 1;
  return amounts;
}

function interleave<T>(lists: T[][]): T[] {
  const merged: T[] = [];
  const maxLength = Math.max(0, ...lists.map((list) => list.length));
  for (let i = 0; i < maxLength; i++) {
    for (const list of lists) {
      if (i < list.length) merged.push(list[i]);
    }
  }
  return merged;
}

async function fetchOtdbQuestions(
  amount: number,
  categoryIds: number[],
  difficulty?: Difficulty,
): Promise<Questions[]> {
  if (categoryIds.length <= 1) {
    return fetchTriviaQuestions(amount, categoryIds[0], difficulty);
  }

  const perCategory = Math.ceil(amount / categoryIds.length);
  const results: Questions[][] = [];
  for (let i = 0; i < categoryIds.length; i++) {
    if (i > 0) await sleep(OTDB_RATE_LIMIT_DELAY_MS);
    try {
      results.push(
        await fetchTriviaQuestions(perCategory, categoryIds[i], difficulty),
      );
    } catch (error) {
      console.error(
        `Skipping OTDB category ${categoryIds[i]} for this round:`,
        error,
      );
      results.push([]);
    }
  }
  return interleave(results).slice(0, amount);
}

// "Other" (copy.admin.noCategoryLabel) represents questions with no
// category set at all — Prisma's `in` filter can't match `null`, so it
// needs its own clause, OR'd alongside any real category names selected.
function buildAdminQuestionWhere(
  categoryNames: string[],
  difficulty: Difficulty | undefined,
) {
  const hasFilter = categoryNames.length > 0;
  const realCategoryNames = categoryNames.filter(
    (name) => name !== copy.admin.noCategoryLabel,
  );
  const includesOther = categoryNames.includes(copy.admin.noCategoryLabel);

  return {
    ...(hasFilter && {
      OR: [
        ...(realCategoryNames.length > 0
          ? [{ category: { in: realCategoryNames } }]
          : []),
        ...(includesOther ? [{ category: null }] : []),
      ],
    }),
    ...(difficulty && { difficulty }),
  };
}

async function fetchAdminQuestions(
  amount: number,
  categoryNames: string[],
  difficulty: Difficulty | undefined,
): Promise<Questions[]> {
  const adminQuestions = await prisma.question.findMany({
    where: buildAdminQuestionWhere(categoryNames, difficulty),
    select: {
      id: true,
      text: true,
      choices: true,
      correctAnswer: true,
      category: true,
      difficulty: true,
      imageUrl: true,
    },
  });

  return shuffle(adminQuestions)
    .slice(0, amount)
    .map((question) => ({
      id: question.id,
      text: question.text,
      choices: shuffle(question.choices),
      correctAnswer: question.correctAnswer,
      category: question.category ?? copy.admin.noCategoryLabel,
      difficulty: question.difficulty,
      imageUrl: question.imageUrl,
    }));
}

export async function getRoundQuestions(
  amount: number,
  categoryNames: string[] = [],
  difficulty?: Difficulty,
): Promise<Questions[]> {
  const hasFilter = categoryNames.length > 0;
  const mappedAdmin = await fetchAdminQuestions(
    amount,
    categoryNames,
    difficulty,
  );

  const otdbCount = amount - mappedAdmin.length;
  const otdbCategoryIds = hasFilter ? pickOtdbCategoryIds(categoryNames) : [];
  const otdbQuestions =
    otdbCount > 0 && (!hasFilter || otdbCategoryIds.length > 0)
      ? await fetchOtdbQuestions(otdbCount, otdbCategoryIds, difficulty)
      : [];
  return shuffle([...mappedAdmin, ...otdbQuestions]);
}

export async function getInitialRoundQuestions(
  amount: number,
  categoryNames: string[] = [],
  difficulty?: Difficulty,
): Promise<{
  questions: Questions[];
  pendingCategoryIds: number[];
  pendingCounts: number[];
}> {
  const hasFilter = categoryNames.length > 0;
  const mappedAdmin = await fetchAdminQuestions(
    amount,
    categoryNames,
    difficulty,
  );
  const otdbCount = amount - mappedAdmin.length;

  const empty = {
    questions: shuffle(mappedAdmin),
    pendingCategoryIds: [],
    pendingCounts: [],
  };
  if (otdbCount <= 0) return empty;

  if (!hasFilter) {
    const firstBatch = await fetchTriviaQuestions(
      otdbCount,
      undefined,
      difficulty,
    );
    return {
      questions: shuffle([...mappedAdmin, ...firstBatch]),
      pendingCategoryIds: [],
      pendingCounts: [],
    };
  }

  const shuffledIds = shuffleOtdbCategoryIds(categoryNames);
  if (shuffledIds.length === 0) return empty;

  // Never use more categories than there are questions to hand out — a
  // category assigned 0 questions would just be a wasted background fetch.
  const usedIds = shuffledIds.slice(0, Math.min(shuffledIds.length, otdbCount));
  const counts = distributeCounts(otdbCount, usedIds.length);

  const [firstCategoryId, ...pendingCategoryIds] = usedIds;
  const [firstCount, ...pendingCounts] = counts;
  const firstBatch = await fetchTriviaQuestions(
    firstCount,
    firstCategoryId,
    difficulty,
  );

  return {
    questions: shuffle([...mappedAdmin, ...firstBatch]),
    pendingCategoryIds,
    pendingCounts,
  };
}

// Best-effort fetch for exactly one more selected category, called by the
// client in the background while the player is already answering earlier
// questions — failures (rate limit, etc.) are the caller's to swallow, same
// philosophy as the multi-category loop in fetchOtdbQuestions above.
export async function getNextCategoryQuestions(
  amount: number,
  categoryId: number,
  difficulty?: Difficulty,
): Promise<Questions[]> {
  return fetchTriviaQuestions(amount, categoryId, difficulty);
}

// Lets the Ready screen warn before starting a round, but only when the
// answer is actually knowable: the admin pool's count is an exact, instant
// DB query, but OTDB's real availability isn't — checking it would mean
// extra calls and reintroducing the latency this whole progressive-loading
// approach was built to avoid. So this only reports a hard shortfall when
// no real OTDB category is in play at all (e.g. only "Other" and/or
// "Better Developers" selected) and the admin pool alone can't cover it —
// otherwise it's silent, trusting OTDB (which is essentially always
// sufficient) and falling back on the results-screen note if it isn't.
export async function checkRoundAvailability(
  categoryNames: string[] = [],
  difficulty?: Difficulty,
): Promise<{ adminCount: number; hasRealOtdbCategory: boolean }> {
  const adminCount = await prisma.question.count({
    where: buildAdminQuestionWhere(categoryNames, difficulty),
  });
  const hasRealOtdbCategory =
    categoryNames.length === 0 ||
    shuffleOtdbCategoryIds(categoryNames).length > 0;

  return { adminCount, hasRealOtdbCategory };
}

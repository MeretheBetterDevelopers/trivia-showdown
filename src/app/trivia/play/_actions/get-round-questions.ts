"use server";

import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import categories from "@/src/lib/constants/categories.json";
import { copy } from "@/src/lib/constants/copy";
import { shuffle } from "@/src/lib/helpers/shuffle-items";
import { prisma } from "@/src/lib/prisma";
import { Questions } from "@/src/types/game/question";

const OTDB_CATEGORY_IDS: Record<string, number> = Object.fromEntries(
  categories.trivia_categories
    .filter((category) => category.name !== "Better Developers")
    .map((category) => [category.name, category.id]),
);

// OTDB only accepts one category per request, so blending N selected
// categories into one round means N separate calls. Cap it — beyond this,
// each extra selected category just isn't guaranteed a slice this round
// (rerolls on the next round instead) — to bound how many near-simultaneous
// requests we send OTDB, which rate-limits aggressively per IP.
const MAX_OTDB_CATEGORIES_PER_ROUND = 3;

function pickOtdbCategoryIds(names: string[]): number[] {
  const ids = names
    .map((name) => OTDB_CATEGORY_IDS[name])
    .filter((id): id is number => id !== undefined);
  return shuffle(ids).slice(0, MAX_OTDB_CATEGORIES_PER_ROUND);
}

// Round-robin merge so slicing down to the round size doesn't just keep
// whichever category's results happened to land first in the array —
// every successful category gets a fair share of the final round.
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
): Promise<Questions[]> {
  // 0 or 1 categories: unchanged single-call behavior, including letting
  // errors (rate limit, etc.) propagate so the player sees why it failed.
  if (categoryIds.length <= 1) {
    return fetchTriviaQuestions(amount, categoryIds[0]);
  }

  // Multiple categories: each call is best-effort. If OTDB rate-limits one
  // of them, that category just contributes nothing this round rather than
  // failing the whole round — the other categories (and the admin pool)
  // still carry it, falling back to the "shrink the round" behavior only
  // if everything comes up empty.
  const perCategory = Math.ceil(amount / categoryIds.length);
  const results = await Promise.all(
    categoryIds.map(async (categoryId) => {
      try {
        return await fetchTriviaQuestions(perCategory, categoryId);
      } catch (error) {
        console.error(
          `Skipping OTDB category ${categoryId} for this round:`,
          error,
        );
        return [];
      }
    }),
  );
  return interleave(results).slice(0, amount);
}

export async function getRoundQuestions(
  amount: number,
  categoryNames: string[] = [],
): Promise<Questions[]> {
  const hasFilter = categoryNames.length > 0;

  const adminQuestions = await prisma.question.findMany({
    where: hasFilter ? { category: { in: categoryNames } } : undefined,
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

  const mappedAdmin: Questions[] = shuffle(adminQuestions)
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

  const otdbCount = amount - mappedAdmin.length;
  const otdbCategoryIds = hasFilter ? pickOtdbCategoryIds(categoryNames) : [];
  const otdbQuestions =
    otdbCount > 0 && (!hasFilter || otdbCategoryIds.length > 0)
      ? await fetchOtdbQuestions(otdbCount, otdbCategoryIds)
      : [];

  // Zero matches for the selected categories is an expected outcome (e.g. a
  // company category with nothing authored yet), not a server error —
  // return an empty round and let the caller show a friendly message
  // instead of throwing, which Next.js would otherwise surface as a raw
  // Server Action 500.
  return shuffle([...mappedAdmin, ...otdbQuestions]);
}

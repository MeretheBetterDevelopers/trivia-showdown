"use server";

import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import { copy } from "@/src/lib/constants/copy";
import { shuffle } from "@/src/lib/helpers/shuffle-items";
import { prisma } from "@/src/lib/prisma";
import { Questions } from "@/src/types/game/question";

export async function getRoundQuestions(amount: number): Promise<Questions[]> {
  const adminQuestions = await prisma.question.findMany({
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
  const otdbQuestions =
    otdbCount > 0 ? await fetchTriviaQuestions(otdbCount) : [];

  return shuffle([...mappedAdmin, ...otdbQuestions]);
}

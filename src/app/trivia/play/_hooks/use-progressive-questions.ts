"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getInitialRoundQuestions,
  getNextCategoryQuestions,
} from "../_actions/get-round-questions";
import { Questions } from "@/src/types/game/question";
import { Difficulty } from "@/src/generated/prisma/enums";

// OTDB allows roughly one request per 5 seconds per IP. Spacing background
// category fetches out by this much — while the player is already reading
// or answering an earlier question — means the delay is real but never
// perceived as a loading wait.
const CLIENT_CATEGORY_DELAY_MS = 5500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type InitialBatch = {
  questions: Questions[];
  pendingCategoryIds: number[];
  pendingCounts: number[];
};

export function useProgressiveQuestions({
  enabled,
  roundId,
  questionCount,
  categoryNames,
  difficulty,
}: Readonly<{
  enabled: boolean;
  roundId: number;
  questionCount: number;
  categoryNames: string[];
  difficulty?: Difficulty;
}>) {
  const initial = useQuery({
    queryKey: [
      "trivia-questions-initial",
      roundId,
      categoryNames,
      difficulty,
      questionCount,
    ],
    queryFn: () =>
      getInitialRoundQuestions(questionCount, categoryNames, difficulty),
    enabled,
    gcTime: 0,
  });

  // Extra questions gathered by the background loop below, kept separate
  // from initial.data so seeding a new batch never needs a setState-in-
  // effect — it's just reset here, during render, when the query result
  // identity changes (React's documented "adjusting state on prop change"
  // pattern, not an effect).
  const [prevData, setPrevData] = useState<InitialBatch | undefined>(
    initial.data,
  );
  const [extraQuestions, setExtraQuestions] = useState<Questions[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  if (initial.data !== prevData) {
    setPrevData(initial.data);
    setExtraQuestions([]);
    setIsFetchingMore(!!initial.data && initial.data.pendingCategoryIds.length > 0);
  }

  // Raw arrival order — categories arrive in the order the initial fetch
  // randomized them in, each contributing however many questions
  // distributeCounts assigned it. Reshuffling the not-yet-seen portion of
  // the round as each batch lands is GameScreen/useTriviaGame's job (it's
  // the one that knows how far the player has actually gotten).
  const questions = initial.data
    ? [...initial.data.questions, ...extraQuestions]
    : [];

  useEffect(() => {
    if (!initial.data) return;
    if (initial.data.pendingCategoryIds.length === 0) return;

    let cancelled = false;
    let pendingIds = initial.data.pendingCategoryIds;
    let pendingCounts = initial.data.pendingCounts;

    async function loadMore() {
      while (!cancelled && pendingIds.length > 0) {
        await sleep(CLIENT_CATEGORY_DELAY_MS);
        if (cancelled) return;

        const [nextCategoryId, ...restIds] = pendingIds;
        const [nextCount, ...restCounts] = pendingCounts;
        pendingIds = restIds;
        pendingCounts = restCounts;

        try {
          const more = await getNextCategoryQuestions(
            nextCount,
            nextCategoryId,
            difficulty,
          );
          if (!cancelled) {
            setExtraQuestions((current) => [...current, ...more]);
          }
        } catch (error) {
          // Best-effort — this category just contributes nothing, matches
          // the same philosophy as the multi-category loop in
          // fetchOtdbQuestions (server-side, used by getRoundQuestions).
          console.error(
            `Skipping OTDB category ${nextCategoryId} for this round:`,
            error,
          );
        }
      }
      if (!cancelled) setIsFetchingMore(false);
    }

    loadMore();

    return () => {
      cancelled = true;
    };
  }, [initial.data, difficulty]);

  return {
    status: initial.status,
    error: initial.error,
    questions,
    isFetchingMore,
    refetch: initial.refetch,
  };
}

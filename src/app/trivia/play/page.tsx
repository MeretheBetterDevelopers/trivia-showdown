"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import { Button } from "@/src/components/ui/button";
import { GameScreen } from "./_components/game-screen";
import { QuestionCardSkeleton } from "./_components/question-card-skeleton";
import { ReadyScreen } from "./_components/ready-screen";
import { QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";

export default function Page() {
  const [ready, setReady] = useState(false);
  // Seeded per mount (not a fixed 0) so navigating away and back never
  // reuses a stale cache entry from the last time this page was visited.
  const [roundId, setRoundId] = useState(() => Date.now());

  const {
    data: questions,
    status,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trivia-questions", roundId],
    queryFn: () => fetchTriviaQuestions(QUESTION_COUNT),
    enabled: ready,
    gcTime: 0,
  });

  if (!ready) {
    return <ReadyScreen onBegin={() => setReady(true)} />;
  }
  return (
    <>
      {status === "pending" && <QuestionCardSkeleton />}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : copy.trivia.genericErrorMessage}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            {copy.trivia.retryButton}
          </Button>
        </div>
      )}

      {status === "success" && questions && (
        <GameScreen
          key={roundId}
          questions={questions}
          onPlayAgain={() => setRoundId((id) => id + 1)}
        />
      )}
    </>
  );
}

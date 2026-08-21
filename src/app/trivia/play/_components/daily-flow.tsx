"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/src/components/ui/button";
import { getDailyRound } from "../_actions/get-daily-round";
import { DailyReadyScreen } from "./daily-ready-screen";
import { GameScreen } from "./game-screen";
import { NavRow } from "./nav-row";
import { QuestionCardSkeleton } from "./question-card-skeleton";
import { DAILY_QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";

export function DailyFlow({
  onBackToModes,
}: Readonly<{ onBackToModes: () => void }>) {
  const [started, setStarted] = useState(false);
  // Resets useTriviaGame's internal state on replay - the query stays
  // cached, so this doesn't re-fetch, just plays the same round again.
  const [playKey, setPlayKey] = useState(0);

  const dailyQuery = useQuery({
    queryKey: ["daily-round"],
    queryFn: getDailyRound,
    enabled: started,
    gcTime: 0,
  });

  if (!started) {
    return (
      <>
        <DailyReadyScreen onBegin={() => setStarted(true)} />
        <NavRow onBackToModes={onBackToModes} />
      </>
    );
  }

  return (
    <>
      {dailyQuery.status === "pending" && (
        <QuestionCardSkeleton count={DAILY_QUESTION_COUNT} />
      )}

      {dailyQuery.status === "error" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {dailyQuery.error instanceof Error
              ? dailyQuery.error.message
              : copy.trivia.genericErrorMessage}
          </p>
          <Button onClick={() => dailyQuery.refetch()} variant="outline">
            {copy.trivia.retryButton}
          </Button>
        </div>
      )}

      {dailyQuery.status === "success" && (
        <GameScreen
          key={playKey}
          questions={dailyQuery.data.questions}
          isFetchingMore={false}
          requestedTotal={dailyQuery.data.questions.length}
          roundId={dailyQuery.data.roundId}
          onPlayAgain={() => setPlayKey((key) => key + 1)}
        />
      )}

      <NavRow />
    </>
  );
}

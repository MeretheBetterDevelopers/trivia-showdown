"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDailyRound } from "../_actions/get-daily-round";
import { DailyReadyScreen } from "./daily-ready-screen";
import { ErrorRetry } from "./error-retry";
import { GameScreen } from "./game-screen";
import { NavRow } from "./nav-row";
import { QuestionCardSkeleton } from "./question-card-skeleton";
import { DAILY_QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { getErrorMessage } from "@/src/lib/helpers/get-error-message";

export function DailyFlow({
  onBackToModes,
}: Readonly<{ onBackToModes: () => void }>) {
  const [started, setStarted] = useState(false);

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
        <ErrorRetry
          message={getErrorMessage(
            dailyQuery.error,
            copy.trivia.genericErrorMessage,
          )}
          onRetry={() => dailyQuery.refetch()}
        />
      )}

      {dailyQuery.status === "success" && (
        <GameScreen
          questions={dailyQuery.data.questions}
          isFetchingMore={false}
          requestedTotal={dailyQuery.data.questions.length}
          roundId={dailyQuery.data.roundId}
        />
      )}

      <NavRow onBackToModes={onBackToModes} />
    </>
  );
}

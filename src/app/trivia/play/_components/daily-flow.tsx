"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDailyRound } from "../_actions/get-daily-round";
import { resumeDailyRound } from "../_actions/resume-daily-round";
import { saveDailyAnswer } from "../_actions/save-daily-answer";
import { DailyCheckingScreen } from "./daily-checking-screen";
import { DailyReadyScreen } from "./daily-ready-screen";
import { DailyResumeScreen } from "./daily-resume-screen";
import { ErrorRetry } from "./error-retry";
import { GameScreen } from "./game-screen";
import { NavRow } from "./nav-row";
import { ResultsScreen } from "./results-screen";
import { copy } from "@/src/lib/constants/copy";
import { getErrorMessage } from "@/src/lib/helpers/get-error-message";

export function DailyFlow({
  onBackToModes,
}: Readonly<{ onBackToModes: () => void }>) {
  const [started, setStarted] = useState(false);
  const [resumed, setResumed] = useState<{
    index: number;
    score: number;
  } | null>(null);
  const [isResuming, startResuming] = useTransition();
  const [hasUnansweredQuestion, setHasUnansweredQuestion] = useState(false);

  const dailyQuery = useQuery({
    queryKey: ["daily-round"],
    queryFn: getDailyRound,
    gcTime: 0,
  });

  function handleContinue(roundId: string) {
    startResuming(async () => {
      const { answers } = await resumeDailyRound(roundId);
      setResumed({
        index: answers.length,
        score: answers.filter((answer) => answer.correct).length,
      });
    });
  }

  const { data } = dailyQuery;
  const progress = data?.progress;
  const isFreshRound = !!data && !progress;

  return (
    <>
      {dailyQuery.status === "pending" && <DailyCheckingScreen />}

      {dailyQuery.status === "error" && (
        <ErrorRetry
          message={getErrorMessage(
            dailyQuery.error,
            copy.trivia.genericErrorMessage,
          )}
          onRetry={() => dailyQuery.refetch()}
        />
      )}

      {isFreshRound && !started && (
        <DailyReadyScreen onBegin={() => setStarted(true)} />
      )}

      {data && progress?.completed && (
        <ResultsScreen
          score={progress.score}
          total={data.questions.length}
          requestedTotal={data.questions.length}
          roundId={data.roundId}
        />
      )}

      {data && progress && !progress.completed && !resumed && (
        <DailyResumeScreen
          answered={progress.answers.length + 1}
          total={data.questions.length}
          disabled={isResuming}
          onContinue={() => handleContinue(data.roundId)}
        />
      )}

      {data && ((isFreshRound && started) || resumed) && (
        <GameScreen
          questions={data.questions}
          isFetchingMore={false}
          requestedTotal={data.questions.length}
          roundId={data.roundId}
          initialIndex={resumed?.index}
          initialScore={resumed?.score}
          onAnswer={(index, choice, isCorrect) => {
            saveDailyAnswer(data.roundId, index, choice, isCorrect).catch(
              () => {
                // Best-effort: a failed save just means this question
                // won't persist for resume purposes, not a blocking error.
              },
            );
          }}
          onActiveQuestionChange={setHasUnansweredQuestion}
        />
      )}

      <NavRow
        onBackToModes={onBackToModes}
        confirmLeave={hasUnansweredQuestion}
      />
    </>
  );
}

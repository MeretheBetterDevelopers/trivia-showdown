"use client";

import { useState, useTransition } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRound } from "../_actions/get-round";
import { ScheduledRoundMode } from "@/src/lib/helpers/round-window";
import { resumeRound } from "../_actions/resume-round";
import { saveRoundAnswer } from "../_actions/save-round-answer";
import { ErrorRetry } from "./error-retry";
import { GameScreen } from "./game-screen";
import { NavRow } from "./nav-row";
import { ResultsScreen } from "./results-screen";
import { RoundReadyScreen } from "./round-ready-screen";
import { RoundResumeScreen } from "./round-resume-screen";
import { copy } from "@/src/lib/constants/copy";
import { getErrorMessage } from "@/src/lib/helpers/get-error-message";

export function RoundFlow({
  mode,
  onBackToModes,
}: Readonly<{ mode: ScheduledRoundMode; onBackToModes: () => void }>) {
  const [started, setStarted] = useState(false);
  const [resumed, setResumed] = useState<{
    index: number;
    score: number;
  } | null>(null);
  const [isResuming, startResuming] = useTransition();
  const [hasUnansweredQuestion, setHasUnansweredQuestion] = useState(false);

  const roundQuery = useQuery({
    queryKey: ["round", mode],
    queryFn: () => getRound(mode),
    gcTime: 0,
  });

  function handleContinue(roundId: string) {
    startResuming(async () => {
      const { answers } = await resumeRound(roundId);
      setResumed({
        index: answers.length,
        score: answers.reduce((sum, answer) => sum + answer.points, 0),
      });
    });
  }

  const { data } = roundQuery;
  const progress = data?.progress;
  // No LeaderboardEntry for this round at all - never played, never even
  // started. Only this case gets the "Ready? Begin" screen; existing
  // progress or a completed round skip straight to resuming/results.
  const isFreshRound = !!data && !progress;

  return (
    <>
      {roundQuery.status === "error" && (
        <ErrorRetry
          message={getErrorMessage(
            roundQuery.error,
            copy.trivia.genericErrorMessage,
          )}
          onRetry={() => roundQuery.refetch()}
        />
      )}

      {isFreshRound && !started && (
        <RoundReadyScreen mode={mode} onBegin={() => setStarted(true)} />
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
        <RoundResumeScreen
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
          onAnswer={(index, choice, isCorrect, points) => {
            saveRoundAnswer(
              data.roundId,
              index,
              choice,
              isCorrect,
              points,
            ).catch(() => {
              // Best-effort: a failed save just means this question
              // won't persist for resume purposes, not a blocking error.
            });
          }}
          onActiveQuestionChange={setHasUnansweredQuestion}
        />
      )}

      {roundQuery.status !== "pending" && (
        <NavRow
          onBackToModes={onBackToModes}
          confirmLeave={hasUnansweredQuestion}
        />
      )}
    </>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { getRoundQuestions } from "./_actions/get-round-questions";
import { GameScreen } from "./_components/game-screen";
import { QuestionCardSkeleton } from "./_components/question-card-skeleton";
import { ReadyScreen, ReadyScreenSettings } from "./_components/ready-screen";
import { QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { Difficulty } from "@/src/generated/prisma/enums";

export default function Page() {
  const [ready, setReady] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );
  const [questionCount, setQuestionCount] = useState(QUESTION_COUNT);
  const [acceptedShortfall, setAcceptedShortfall] = useState(false);
  // Seeded per mount (not a fixed 0) so navigating away and back never
  // reuses a stale cache entry from the last time this page was visited.
  const [roundId, setRoundId] = useState(() => Date.now());

  const {
    data: questions,
    status,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trivia-questions", roundId, categoryNames, difficulty, questionCount],
    queryFn: () => getRoundQuestions(questionCount, categoryNames, difficulty),
    enabled: ready,
    gcTime: 0,
  });

  function handleBegin(settings: ReadyScreenSettings) {
    setCategoryNames(settings.categoryNames);
    setDifficulty(settings.difficulty);
    setQuestionCount(settings.questionCount);
    setAcceptedShortfall(false);
    setReady(true);
  }

  if (!ready) {
    return <ReadyScreen onBegin={handleBegin} />;
  }

  const isShortfall =
    status === "success" &&
    !!questions &&
    questions.length > 0 &&
    questions.length < questionCount &&
    !acceptedShortfall;

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

      {status === "success" && questions && questions.length === 0 && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {copy.trivia.noQuestionsForCategoriesMessage}
          </p>
          <Button onClick={() => setReady(false)} variant="outline">
            {copy.trivia.retryButton}
          </Button>
        </div>
      )}

      {isShortfall && questions && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {copy.trivia.shortRoundWarning
              .replaceAll("{available}", String(questions.length))
              .replaceAll("{requested}", String(questionCount))}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setAcceptedShortfall(true)}
              variant="default"
            >
              {copy.trivia.playWithAvailableButton.replaceAll(
                "{available}",
                String(questions.length),
              )}
            </Button>
            <Button onClick={() => setReady(false)} variant="outline">
              {copy.trivia.chooseMoreCategoriesButton}
            </Button>
          </div>
        </div>
      )}

      {status === "success" && questions && questions.length > 0 && !isShortfall && (
        <GameScreen
          key={roundId}
          questions={questions}
          onPlayAgain={() => {
            setAcceptedShortfall(false);
            setRoundId((id) => id + 1);
          }}
        />
      )}
    </>
  );
}

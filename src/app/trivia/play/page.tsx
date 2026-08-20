"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { useProgressiveQuestions } from "./_hooks/use-progressive-questions";
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
  // Seeded per mount (not a fixed 0) so navigating away and back never
  // reuses a stale cache entry from the last time this page was visited.
  const [roundId, setRoundId] = useState(() => Date.now());

  const { questions, status, error, isFetchingMore, refetch } =
    useProgressiveQuestions({
      enabled: ready,
      roundId,
      questionCount,
      categoryNames,
      difficulty,
    });

  function handleBegin(settings: ReadyScreenSettings) {
    setCategoryNames(settings.categoryNames);
    setDifficulty(settings.difficulty);
    setQuestionCount(settings.questionCount);
    setReady(true);
  }

  if (!ready) {
    return <ReadyScreen onBegin={handleBegin} />;
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

      {status === "success" && questions.length === 0 && isFetchingMore && (
        <QuestionCardSkeleton />
      )}

      {status === "success" && questions.length === 0 && !isFetchingMore && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {copy.trivia.noQuestionsForCategoriesMessage}
          </p>
          <Button onClick={() => setReady(false)} variant="outline">
            {copy.trivia.retryButton}
          </Button>
        </div>
      )}

      {status === "success" && questions.length > 0 && (
        <GameScreen
          key={roundId}
          questions={questions}
          isFetchingMore={isFetchingMore}
          requestedTotal={questionCount}
          onPlayAgain={() => setRoundId((id) => id + 1)}
        />
      )}
    </>
  );
}

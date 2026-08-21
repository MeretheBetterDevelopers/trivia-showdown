"use client";

import { useEffect } from "react";
import { Questions } from "@/src/types/game/question";
import { useTriviaGame } from "../_hooks/use-trivia-game";
import { QuestionCard } from "./question-card";
import { QuestionCardSkeleton } from "./question-card-skeleton";
import { ResultsScreen } from "./results-screen";

export function GameScreen({
  questions,
  isFetchingMore,
  requestedTotal,
  roundId,
  initialIndex,
  initialScore,
  onAnswer,
  onActiveQuestionChange,
}: Readonly<{
  questions: Questions[];
  isFetchingMore: boolean;
  requestedTotal: number;
  roundId?: string;
  initialIndex?: number;
  initialScore?: number;
  onAnswer?: (index: number, choice: string | null, isCorrect: boolean) => void;
  onActiveQuestionChange?: (hasUnansweredQuestion: boolean) => void;
}>) {
  const game = useTriviaGame({
    questions,
    isFetchingMore,
    initialIndex,
    initialScore,
    onAnswer,
  });

  const hasUnansweredQuestion =
    !game.isFinished && !game.isWaitingForMore && !game.isAnswered;

  useEffect(() => {
    onActiveQuestionChange?.(hasUnansweredQuestion);
  }, [hasUnansweredQuestion, onActiveQuestionChange]);

  if (game.isWaitingForMore) {
    return <QuestionCardSkeleton count={requestedTotal} />;
  }

  if (game.isFinished) {
    return (
      <ResultsScreen
        score={game.score}
        total={game.total}
        requestedTotal={requestedTotal}
        roundId={roundId}
      />
    );
  }

  return (
    <QuestionCard
      question={game.currentQuestion}
      questionNumber={game.currentIndex + 1}
      total={game.total}
      requestedTotal={requestedTotal}
      selectedChoice={game.selectedChoice}
      isAnswered={game.isAnswered}
      onTimeUp={game.handleTimeUp}
      onSelectChoice={game.selectChoice}
      onNext={game.goToNext}
    />
  );
}

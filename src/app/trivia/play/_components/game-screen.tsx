"use client";

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
  onPlayAgain,
}: Readonly<{
  questions: Questions[];
  isFetchingMore: boolean;
  requestedTotal: number;
  roundId?: string;
  onPlayAgain: () => void;
}>) {
  const game = useTriviaGame(questions, isFetchingMore);

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
        onPlayAgain={onPlayAgain}
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

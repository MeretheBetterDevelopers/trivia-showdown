"use client";

import { Questions } from "@/src/types/game/Question";
import { useTriviaGame } from "../../_hooks/useTriviaGame";
import { QuestionCard } from "./QuestionCard";
import { ResultsScreen } from "./ResultsScreen";

export function GameScreen({
  questions,
  onPlayAgain,
}: {
  questions: Questions[];
  onPlayAgain: () => void;
}) {
  const game = useTriviaGame(questions);

  if (game.isFinished) {
    return (
      <ResultsScreen
        score={game.score}
        total={game.total}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  return (
    <QuestionCard
      question={game.currentQuestion}
      questionNumber={game.currentIndex + 1}
      total={game.total}
      selectedChoice={game.selectedChoice}
      isAnswered={game.isAnswered}
      timeLeft={game.timeLeft}
      onSelectChoice={game.selectChoice}
      onNext={game.goToNext}
    />
  );
}

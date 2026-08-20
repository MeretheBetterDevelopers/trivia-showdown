"use client";

import { Questions } from "@/src/types/game/question";
import { useTriviaGame } from "../_hooks/use-trivia-game";
import { QuestionCard } from "./question-card";
import { ResultsScreen } from "./results-screen";

export function GameScreen({
  questions,
  onPlayAgain,
}: Readonly<{
  questions: Questions[];
  onPlayAgain: () => void;
}>) {
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
      onTimeUp={game.handleTimeUp}
      onSelectChoice={game.selectChoice}
      onNext={game.goToNext}
    />
  );
}

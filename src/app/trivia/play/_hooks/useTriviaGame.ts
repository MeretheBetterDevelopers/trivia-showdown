"use client";

import { useCallback, useState } from "react";
import { Questions } from "@/src/types/game/Question";

export function useTriviaGame(questions: Questions[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const isFinished = currentIndex >= questions.length;
  const currentQuestion = isFinished ? undefined : questions[currentIndex];
  const isAnswered = selectedChoice !== null;

  const selectChoice = useCallback(
    (choice: string) => {
      if (isAnswered || isFinished || !currentQuestion) return;
      setSelectedChoice(choice);
      if (choice === currentQuestion.correctAnswer) {
        setScore((s) => s + 1);
      }
    },
    [isAnswered, isFinished, currentQuestion],
  );

  // An empty selection when the timer runs out counts as wrong.
  const handleTimeUp = useCallback(() => {
    setSelectedChoice((current) => current ?? "");
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setSelectedChoice(null);
  }, []);

  const total = questions.length;

  if (isFinished || !currentQuestion) {
    return { isFinished: true as const, score, total };
  }

  return {
    isFinished: false as const,
    currentQuestion,
    currentIndex,
    total,
    selectedChoice,
    isAnswered,
    score,
    selectChoice,
    handleTimeUp,
    goToNext,
  };
}

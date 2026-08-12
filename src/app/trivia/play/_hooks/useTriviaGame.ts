"use client";

import { useCallback, useEffect, useState } from "react";
import { QUESTION_DURATION_SECONDS } from "@/src/lib/constants/game";
import { Questions } from "@/src/types/game/Question";

export function useTriviaGame(questions: Questions[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION_SECONDS);

  const isFinished = currentIndex >= questions.length;
  const currentQuestion = isFinished ? undefined : questions[currentIndex];
  const isAnswered = selectedChoice !== null;

  // Countdown for the current question; an empty selection at 0 counts as wrong.
  useEffect(() => {
    if (isFinished || isAnswered) return;

    const timeoutId = setTimeout(() => {
      if (timeLeft <= 1) {
        setSelectedChoice("");
        setTimeLeft(0);
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [timeLeft, isAnswered, isFinished]);

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

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setSelectedChoice(null);
    setTimeLeft(QUESTION_DURATION_SECONDS);
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
    timeLeft,
    score,
    selectChoice,
    goToNext,
  };
}

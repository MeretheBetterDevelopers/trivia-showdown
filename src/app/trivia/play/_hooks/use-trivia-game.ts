"use client";

import { useCallback, useState } from "react";
import { shuffle } from "@/src/lib/helpers/shuffle-items";
import { Questions } from "@/src/types/game/question";

export function useTriviaGame({
  questions,
  isFetchingMore,
  initialIndex = 0,
  initialScore = 0,
  onAnswer,
}: {
  questions: Questions[];
  isFetchingMore: boolean;
  initialIndex?: number;
  initialScore?: number;
  onAnswer?: (index: number, choice: string | null, isCorrect: boolean) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [score, setScore] = useState(initialScore);

  // The order actually shown to the player. Seeded from `questions`, but
  // whenever it grows (a new background batch landed), only the portion
  // the player hasn't reached yet gets reshuffled together with the
  // newcomers — anything already revealed stays put. This is what makes
  // later-arriving categories genuinely blend into the round instead of
  // just appearing at the tail in fetch order.
  const [displayQuestions, setDisplayQuestions] = useState(questions);

  if (questions.length !== displayQuestions.length) {
    setDisplayQuestions((current) => {
      const revealed = current.slice(0, currentIndex + 1);
      const remainingTail = current.slice(currentIndex + 1);
      const newcomers = questions.slice(current.length);
      return [...revealed, ...shuffle([...remainingTail, ...newcomers])];
    });
  }

  const hasCurrentQuestion = currentIndex < displayQuestions.length;
  const currentQuestion = hasCurrentQuestion
    ? displayQuestions[currentIndex]
    : undefined;
  const isAnswered = selectedChoice !== null;

  const selectChoice = useCallback(
    (choice: string) => {
      if (isAnswered || !currentQuestion) return;
      setSelectedChoice(choice);
      const isCorrect = choice === currentQuestion.correctAnswer;
      if (isCorrect) {
        setScore((s) => s + 1);
      }
      onAnswer?.(currentIndex, choice, isCorrect);
    },
    [isAnswered, currentQuestion, currentIndex, onAnswer],
  );

  // An empty selection when the timer runs out counts as wrong.
  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    setSelectedChoice("");
    onAnswer?.(currentIndex, null, false);
  }, [isAnswered, currentIndex, onAnswer]);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => i + 1);
    setSelectedChoice(null);
  }, []);

  const total = displayQuestions.length;

  if (!hasCurrentQuestion && isFetchingMore) {
    return {
      isFinished: false as const,
      isWaitingForMore: true as const,
      score,
      total,
    };
  }

  if (!hasCurrentQuestion || !currentQuestion) {
    return {
      isFinished: true as const,
      isWaitingForMore: false as const,
      score,
      total,
    };
  }

  return {
    isFinished: false as const,
    isWaitingForMore: false as const,
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

"use client";

import { QUESTION_DURATION_SECONDS } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Questions } from "@/src/types/game/Question";

export function QuestionCard({
  question,
  questionNumber,
  total,
  selectedChoice,
  isAnswered,
  timeLeft,
  onSelectChoice,
  onNext,
}: {
  question: Questions;
  questionNumber: number;
  total: number;
  selectedChoice: string | null;
  isAnswered: boolean;
  timeLeft: number;
  onSelectChoice: (choice: string) => void;
  onNext: () => void;
}) {
  const isLastQuestion = questionNumber === total;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardDescription className="flex items-center justify-between gap-4">
          <span>
            {copy.trivia.questionLabel} {questionNumber} {copy.trivia.ofLabel}{" "}
            {total}
          </span>
          <span className="capitalize">{question.difficulty}</span>
        </CardDescription>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-1000 ease-linear"
            style={{
              width: `${(timeLeft / QUESTION_DURATION_SECONDS) * 100}%`,
            }}
          />
        </div>
        <CardTitle className="pt-2">{question.text}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {question.choices.map((choice, index) => {
            const isCorrectChoice = choice === question.correctAnswer;
            const isSelectedChoice = choice === selectedChoice;

            return (
              <li key={`${question.id}-${index}`}>
                <button
                  type="button"
                  onClick={() => onSelectChoice(choice)}
                  disabled={isAnswered}
                  className={`w-full rounded-lg border px-4 py-2 text-left transition-colors ${
                    isAnswered && isCorrectChoice
                      ? "border-success bg-success/10 text-success"
                      : isAnswered && isSelectedChoice
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-border"
                  }`}
                >
                  {choice}
                </button>
              </li>
            );
          })}
        </ul>
      </CardContent>
      {isAnswered && (
        <CardFooter className="justify-end">
          <Button onClick={onNext}>
            {isLastQuestion
              ? copy.trivia.seeResultsButton
              : copy.trivia.nextButton}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

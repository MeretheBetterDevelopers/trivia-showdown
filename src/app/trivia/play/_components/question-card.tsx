"use client";

import { clsx } from "clsx";
import { copy } from "@/src/lib/constants/copy";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Questions } from "@/src/types/game/question";
import ProgressIndicator from "./progress-indicator";
import DifficultyPlate from "./difficulty-plate";
import TimeLeft from "./time-left";
import ChoiceButton from "./choice-button";

export function QuestionCard({
  question,
  questionNumber,
  total,
  requestedTotal,
  selectedChoice,
  isAnswered,
  onTimeUp,
  onSelectChoice,
  onNext,
}: Readonly<{
  question: Questions;
  questionNumber: number;
  total: number;
  requestedTotal: number;
  selectedChoice: string | null;
  isAnswered: boolean;
  onTimeUp: () => void;
  onSelectChoice: (choice: string) => void;
  onNext: () => void;
}>) {
  const isLastQuestion = questionNumber === total;
  const isTimedOut = isAnswered && selectedChoice === "";

  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <ProgressIndicator
            questionNumber={questionNumber}
            total={requestedTotal}
          />
          <DifficultyPlate question={question} />
        </div>
        <TimeLeft
          resetKey={question.id}
          isAnswered={isAnswered}
          onTimeUp={onTimeUp}
        />
        {question.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={question.imageUrl}
            alt=""
            className="h-40 w-full rounded-lg object-cover"
          />
        )}
        <h2 className="font-heading text-2xl font-bold text-balance">
          {question.text}
        </h2>
        {isTimedOut && (
          <p className="text-sm font-medium text-destructive">
            {copy.trivia.timesUpMessage}
          </p>
        )}
        <div
          className={clsx(
            "rounded-2xl border-2 p-1.5 transition-colors",
            isTimedOut ? "border-destructive" : "border-transparent",
          )}
        >
          <ul className="flex flex-col gap-3">
            {question.choices.map((choice, index) => {
              const isCorrectChoice = choice === question.correctAnswer;
              const isSelectedChoice = choice === selectedChoice;
              const badgeLetter = String.fromCharCode(65 + index);

              return (
                <li key={`${question.id}-${index}`}>
                  <ChoiceButton
                    choice={choice}
                    index={index}
                    isAnswered={isAnswered}
                    isCorrectChoice={isCorrectChoice}
                    isSelectedChoice={isSelectedChoice}
                    onSelectChoice={onSelectChoice}
                    badgeLetter={badgeLetter}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </CardContent>

      {isAnswered && (
        <CardFooter className="justify-end">
          <Button onClick={onNext} size="lg">
            {isLastQuestion
              ? copy.trivia.seeResultsButton
              : copy.trivia.nextButton}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

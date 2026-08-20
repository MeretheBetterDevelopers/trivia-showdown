"use client";

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
  selectedChoice,
  isAnswered,
  onTimeUp,
  onSelectChoice,
  onNext,
}: Readonly<{
  question: Questions;
  questionNumber: number;
  total: number;
  selectedChoice: string | null;
  isAnswered: boolean;
  onTimeUp: () => void;
  onSelectChoice: (choice: string) => void;
  onNext: () => void;
}>) {
  const isLastQuestion = questionNumber === total;
  console.log("rerender");

  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <ProgressIndicator questionNumber={questionNumber} total={total} />
          <DifficultyPlate question={question} />
        </div>
        <TimeLeft
          resetKey={question.id}
          isAnswered={isAnswered}
          onTimeUp={onTimeUp}
        />
        <h2 className="font-heading text-2xl font-bold text-balance">
          {question.text}
        </h2>
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

"use client";

import { clsx } from "clsx";
import { copy } from "@/src/lib/constants/copy";
import { Button } from "@/src/components/ui/button";
import { CardContent, CardFooter } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
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
    <GlassCard>
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

      {/* Always rendered (rather than only once answered) so the card's
          height stays constant - the button just isn't interactive or
          visible until then. Answering shouldn't shift anything below
          the card, e.g. the nav row that follows it during gameplay. */}
      <CardFooter className="justify-end">
        <Button
          onClick={onNext}
          size="lg"
          disabled={!isAnswered}
          // transition-none: Button's base `transition-all` delays
          // `visibility: hidden` until the transition duration elapses
          // (browsers apply hidden at the *end* of the transition, but
          // visible at the *start*), so becoming invisible on the next
          // question would flash briefly instead of disappearing at once.
          className={clsx(!isAnswered && "invisible", "transition-none")}
        >
          {isLastQuestion
            ? copy.trivia.seeResultsButton
            : copy.trivia.nextButton}
        </Button>
      </CardFooter>
    </GlassCard>
  );
}

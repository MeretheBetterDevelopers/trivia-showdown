"use client";

import { Check } from "lucide-react";
import { clsx } from "clsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

export type QuestionRow = {
  id: string;
  text: string;
  choices: string[];
  correctAnswer: string;
  category: string | null;
  difficulty: "easy" | "medium" | "hard";
  imageUrl: string | null;
};

export function QuestionDetailDialog({
  question,
  onOpenChange,
}: Readonly<{
  question: QuestionRow | null;
  onOpenChange: (open: boolean) => void;
}>) {
  return (
    <Dialog open={question !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {question && (
          <>
            <DialogHeader>
              <DialogTitle>{question.text}</DialogTitle>
            </DialogHeader>
            {question.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.imageUrl}
                alt=""
                className="h-40 w-full rounded-lg object-cover"
              />
            )}
            <ul className="flex flex-col gap-2">
              {question.choices.map((choice) => {
                const isCorrect = choice === question.correctAnswer;
                return (
                  <li
                    key={choice}
                    className={clsx(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      isCorrect
                        ? "border-success bg-success/20 text-success"
                        : "border-border",
                    )}
                  >
                    {isCorrect && <Check className="size-4 shrink-0" />}
                    {choice}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

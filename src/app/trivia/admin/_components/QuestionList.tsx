"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteQuestion } from "../_actions/deleteQuestion";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";
import { QuestionDetailDialog, QuestionRow } from "./QuestionDetailDialog";

export function QuestionList({
  questions,
}: Readonly<{ questions: QuestionRow[] }>) {
  const [isPending, startTransition] = useTransition();
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionRow | null>(null);

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteQuestion(id);
        toast.success(copy.admin.questionDeletedMessage);
      } catch {
        toast.error(copy.admin.questionDeleteErrorMessage);
      }
    });
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {copy.admin.noQuestionsMessage}
      </p>
    );
  }

  return (
    <>
      <ul className="flex w-full max-w-xl flex-col gap-2">
        {questions.map((question) => (
          <li
            key={question.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-white/30 bg-card/60 px-4 py-3 text-left backdrop-blur-xl backdrop-saturate-150 dark:border-white/10"
          >
            <button
              type="button"
              onClick={() => setSelectedQuestion(question)}
              className="flex-1 text-left"
            >
              <p className="font-medium">{question.text}</p>
              <p className="text-sm text-muted-foreground">
                {question.category ?? copy.admin.noCategoryLabel} ·{" "}
                {question.difficulty}
              </p>
            </button>
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleDelete(question.id)}
            >
              {copy.common.delete}
            </Button>
          </li>
        ))}
      </ul>

      <QuestionDetailDialog
        question={selectedQuestion}
        onOpenChange={(open) => {
          if (!open) setSelectedQuestion(null);
        }}
      />
    </>
  );
}

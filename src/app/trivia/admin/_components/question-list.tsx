"use client";

import { useState } from "react";
import { copy } from "@/src/lib/constants/copy";
import { QuestionDetailDialog, QuestionRow } from "./question-detail-dialog";
import { DeleteQuestionButton } from "./delete-question-button";

export function QuestionList({
  questions,
}: Readonly<{ questions: QuestionRow[] }>) {
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionRow | null>(null);

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
            <DeleteQuestionButton questionId={question.id} />
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

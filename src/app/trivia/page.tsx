"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { Questions } from "@/src/types/game/Question";

type Status = "loading" | "success" | "error";

const RETRY_DELAY_MS = 5000;

export default function Page() {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [hasRetried, setHasRetried] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const data = await fetchTriviaQuestions(10);
      setQuestions(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (status !== "error" || hasRetried) return;

    const timeoutId = setTimeout(() => {
      setHasRetried(true);
      load();
    }, RETRY_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [status, hasRetried, load]);

  const handleRetry = () => {
    setHasRetried(false);
    load();
  };

  const showLoader =
    status === "loading" || (status === "error" && !hasRetried);
  const showRetryButton = status === "error" && hasRetried;

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4 gap-6">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <h1 className="text-4xl font-bold">Trivia Showdown</h1>
        <ThemeToggle />
      </div>

      {showLoader && <p>Loading questions…</p>}

      {showRetryButton && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-danger">{error}</p>
          <button
            onClick={handleRetry}
            className="border border-border rounded-lg px-4 py-2 font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {status === "success" && (
        <ul className="flex flex-col gap-4 w-full max-w-2xl">
          {questions.map((question) => (
            <li
              key={question.id}
              className="border border-border rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{question.category}</span>
                <span className="capitalize">{question.difficulty}</span>
              </div>
              <p className="font-semibold">{question.text}</p>
              <ul className="flex flex-col gap-1">
                {question.choices.map((choice, index) => (
                  <li
                    key={`${question.id}-${index}`}
                    className={
                      choice === question.correctAnswer
                        ? "text-success font-medium"
                        : ""
                    }
                  >
                    {choice}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

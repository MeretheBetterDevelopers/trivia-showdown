"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { copy } from "@/src/lib/constants/copy";
import { WelcomeScreen } from "./WelcomeScreen";

export default function Page() {
  const [started, setStarted] = useState(false);

  const {
    data: questions,
    status,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trivia-questions"],
    queryFn: () => fetchTriviaQuestions(10),
    enabled: started,
  });

  if (!started) {
    return <WelcomeScreen onStart={() => setStarted(true)} />;
  }

  const firstQuestion = questions?.[0];

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 px-4 py-10">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">
          {copy.appName}
        </h1>
        <ThemeToggle />
      </div>

      {status === "pending" && <p>{copy.trivia.loadingMessage}</p>}

      {status === "error" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {error instanceof Error
              ? error.message
              : copy.trivia.genericErrorMessage}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            {copy.trivia.retryButton}
          </Button>
        </div>
      )}

      {status === "success" && firstQuestion && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardDescription className="flex justify-between">
              <span>{firstQuestion.category}</span>
              <span className="capitalize">{firstQuestion.difficulty}</span>
            </CardDescription>
            <CardTitle>{firstQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1">
              {firstQuestion.choices.map((choice, index) => (
                <li
                  key={`${firstQuestion.id}-${index}`}
                  className={
                    choice === firstQuestion.correctAnswer
                      ? "text-success font-medium"
                      : ""
                  }
                >
                  {choice}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

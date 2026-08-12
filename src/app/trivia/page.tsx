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

  const firstQuestion = questions?.[0];

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-4 gap-6">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <h1 className="text-4xl font-bold">Trivia Showdown</h1>
        <ThemeToggle />
      </div>

      {!started && (
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <p className="text-muted-foreground">
            Test your knowledge against the clock and your friends.
          </p>
          <Button onClick={() => setStarted(true)} size="lg">
            Start
          </Button>
        </div>
      )}

      {started && status === "pending" && <p>Loading questions…</p>}

      {started && status === "error" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            Try again
          </Button>
        </div>
      )}

      {started && status === "success" && firstQuestion && (
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

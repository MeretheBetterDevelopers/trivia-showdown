"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchTriviaQuestions } from "@/src/app/services/trivia";
import { Button } from "@/src/components/ui/button";
import { GameScreen } from "../_components/GameScreen";
import { QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";

export default function Page() {
  const [roundId, setRoundId] = useState(0);

  const {
    data: questions,
    status,
    error,
    refetch,
  } = useQuery({
    queryKey: ["trivia-questions", roundId],
    queryFn: () => fetchTriviaQuestions(QUESTION_COUNT),
  });

  return (
    <>
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

      {status === "success" && questions && (
        <GameScreen
          key={roundId}
          questions={questions}
          onPlayAgain={() => setRoundId((id) => id + 1)}
        />
      )}
    </>
  );
}

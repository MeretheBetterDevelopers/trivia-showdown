"use client";

import { useState, useTransition } from "react";
import { Button } from "@/src/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { useProgressiveQuestions } from "./_hooks/use-progressive-questions";
import { checkRoundAvailability } from "./_actions/get-round-questions";
import { GameScreen } from "./_components/game-screen";
import { QuestionCardSkeleton } from "./_components/question-card-skeleton";
import { ReadyScreen, ReadyScreenSettings } from "./_components/ready-screen";
import { QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { Difficulty } from "@/src/generated/prisma/enums";

export default function Page() {
  const [ready, setReady] = useState(false);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty | undefined>(
    undefined,
  );
  const [questionCount, setQuestionCount] = useState(QUESTION_COUNT);
  const [isChecking, startChecking] = useTransition();
  const [shortfall, setShortfall] = useState<{
    settings: ReadyScreenSettings;
    adminCount: number;
  } | null>(null);
  // Seeded per mount (not a fixed 0) so navigating away and back never
  // reuses a stale cache entry from the last time this page was visited.
  const [roundId, setRoundId] = useState(() => Date.now());

  const { questions, status, error, isFetchingMore, refetch } =
    useProgressiveQuestions({
      enabled: ready,
      roundId,
      questionCount,
      categoryNames,
      difficulty,
    });

  function beginRound(settings: ReadyScreenSettings) {
    setCategoryNames(settings.categoryNames);
    setDifficulty(settings.difficulty);
    setQuestionCount(settings.questionCount);
    setReady(true);
  }

  function handleBegin(settings: ReadyScreenSettings) {
    startChecking(async () => {
      const { adminCount, hasRealOtdbCategory } = await checkRoundAvailability(
        settings.categoryNames,
        settings.difficulty,
      );
      // Only knowable for certain when no real OTDB category is in play —
      // otherwise trust OTDB (essentially always sufficient) and fall back
      // on the results-screen note if a round does end up short.
      if (!hasRealOtdbCategory && adminCount < settings.questionCount) {
        setShortfall({ settings, adminCount });
        return;
      }
      beginRound(settings);
    });
  }

  if (!ready) {
    return (
      <>
        <ReadyScreen onBegin={handleBegin} disabled={isChecking} />
        <AlertDialog
          open={shortfall !== null}
          onOpenChange={(open) => {
            if (!open) setShortfall(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {copy.trivia.shortfallDialogTitle}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {shortfall &&
                  copy.trivia.shortfallDialogDescription
                    .replaceAll("{available}", String(shortfall.adminCount))
                    .replaceAll(
                      "{requested}",
                      String(shortfall.settings.questionCount),
                    )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {copy.trivia.chooseMoreCategoriesButton}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!shortfall) return;
                  beginRound({
                    ...shortfall.settings,
                    questionCount: shortfall.adminCount,
                  });
                  setShortfall(null);
                }}
              >
                {shortfall &&
                  copy.trivia.playWithAvailableButton.replaceAll(
                    "{available}",
                    String(shortfall.adminCount),
                  )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      {status === "pending" && <QuestionCardSkeleton />}

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

      {status === "success" && questions.length === 0 && isFetchingMore && (
        <QuestionCardSkeleton />
      )}

      {status === "success" && questions.length === 0 && !isFetchingMore && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-destructive">
            {copy.trivia.noQuestionsForCategoriesMessage}
          </p>
          <Button onClick={() => setReady(false)} variant="outline">
            {copy.trivia.retryButton}
          </Button>
        </div>
      )}

      {status === "success" && questions.length > 0 && (
        <GameScreen
          key={roundId}
          questions={questions}
          isFetchingMore={isFetchingMore}
          requestedTotal={questionCount}
          onPlayAgain={() => setRoundId((id) => id + 1)}
        />
      )}
    </>
  );
}

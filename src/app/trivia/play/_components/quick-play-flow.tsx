"use client";

import { useState, useTransition } from "react";
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
import { useProgressiveQuestions } from "../_hooks/use-progressive-questions";
import { checkRoundAvailability } from "../_actions/get-round-questions";
import { ErrorRetry } from "./error-retry";
import { GameScreen } from "./game-screen";
import { NavRow } from "./nav-row";
import { QuestionCardSkeleton } from "./question-card-skeleton";
import { ReadyScreen, ReadyScreenSettings } from "./ready-screen";
import { QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { getErrorMessage } from "@/src/lib/helpers/get-error-message";
import { pluralize } from "@/src/lib/helpers/pluralize";
import { Difficulty } from "@/src/generated/prisma/enums";

export function QuickPlayFlow({
  onBackToModes,
}: Readonly<{ onBackToModes: () => void }>) {
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
  // reuses a stale cache entry from the last time this flow was visited.
  const [playKey] = useState(() => Date.now());
  const [hasUnansweredQuestion, setHasUnansweredQuestion] = useState(false);

  const { questions, status, error, isFetchingMore, refetch } =
    useProgressiveQuestions({
      enabled: ready,
      roundId: playKey,
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
        <NavRow onBackToModes={onBackToModes} />
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
                    .replaceAll(
                      "{available}",
                      pluralize(shortfall.adminCount, "question"),
                    )
                    .replaceAll(
                      "{requested}",
                      pluralize(shortfall.settings.questionCount, "question"),
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
                    pluralize(shortfall.adminCount, "question"),
                  )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  const isGameScreenActive = status === "success" && questions.length > 0;

  return (
    <>
      {status === "pending" && <QuestionCardSkeleton count={questionCount} />}

      {status === "error" && (
        <ErrorRetry
          message={getErrorMessage(error, copy.trivia.genericErrorMessage)}
          onRetry={() => refetch()}
        />
      )}

      {status === "success" && questions.length === 0 && isFetchingMore && (
        <QuestionCardSkeleton count={questionCount} />
      )}

      {status === "success" && questions.length === 0 && !isFetchingMore && (
        <ErrorRetry
          message={copy.trivia.noQuestionsForCategoriesMessage}
          onRetry={() => setReady(false)}
        />
      )}

      {isGameScreenActive && (
        <GameScreen
          questions={questions}
          isFetchingMore={isFetchingMore}
          requestedTotal={questionCount}
          onActiveQuestionChange={setHasUnansweredQuestion}
        />
      )}

      <NavRow
        onBackToModes={onBackToModes}
        confirmLeave={hasUnansweredQuestion}
      />
    </>
  );
}

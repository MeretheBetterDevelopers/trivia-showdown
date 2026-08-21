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
import { BackToHomeButton } from "@/src/components/trivia-nav-controls";
import { useProgressiveQuestions } from "./_hooks/use-progressive-questions";
import { checkRoundAvailability } from "./_actions/get-round-questions";
import { ComingSoonScreen } from "./_components/coming-soon-screen";
import { GameScreen } from "./_components/game-screen";
import { GameMode, ModeSelectScreen } from "./_components/mode-select-screen";
import { QuestionCardSkeleton } from "./_components/question-card-skeleton";
import { ReadyScreen, ReadyScreenSettings } from "./_components/ready-screen";
import { QUESTION_COUNT } from "@/src/lib/constants/game";
import { copy } from "@/src/lib/constants/copy";
import { pluralize } from "@/src/lib/helpers/pluralize";
import { Difficulty } from "@/src/generated/prisma/enums";

const COMING_SOON_MODE_LABELS: Record<Exclude<GameMode, "quick">, string> = {
  daily: copy.trivia.dailyLabel,
  weekly: copy.trivia.weeklyLabel,
  monthly: copy.trivia.monthlyLabel,
  event: copy.trivia.eventLabel,
  room: copy.trivia.gameRoomLabel,
};

function NavRow({ onBackToModes }: Readonly<{ onBackToModes?: () => void }>) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {onBackToModes && (
        <Button onClick={onBackToModes} variant="outline" size="lg">
          {copy.trivia.backToModesButton}
        </Button>
      )}
      <BackToHomeButton />
    </div>
  );
}

export default function Page() {
  const [mode, setMode] = useState<GameMode | null>(null);
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

  if (mode === null) {
    return (
      <>
        <ModeSelectScreen onSelectMode={setMode} />
        <NavRow />
      </>
    );
  }

  if (mode !== "quick") {
    return (
      <>
        <ComingSoonScreen modeLabel={COMING_SOON_MODE_LABELS[mode]} />
        <NavRow onBackToModes={() => setMode(null)} />
      </>
    );
  }

  if (!ready) {
    return (
      <>
        <ReadyScreen onBegin={handleBegin} disabled={isChecking} />
        <NavRow onBackToModes={() => setMode(null)} />
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

  return (
    <>
      {status === "pending" && <QuestionCardSkeleton count={questionCount} />}

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
        <QuestionCardSkeleton count={questionCount} />
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

      <NavRow />
    </>
  );
}

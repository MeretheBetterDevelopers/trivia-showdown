"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { GameLogo } from "@/src/components/game-logo";
import { copy } from "@/src/lib/constants/copy";
import { pluralize } from "@/src/lib/helpers/pluralize";
import { saveScore } from "../_actions/save-score";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";

function getReaction(score: number, total: number) {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.8) return copy.results.reactionGreat;
  if (ratio >= 0.5) return copy.results.reactionGood;
  if (ratio >= 0.3) return copy.results.reactionOkay;
  return copy.results.reactionTryAgain;
}

export function ResultsScreen({
  score,
  total,
  requestedTotal,
  onPlayAgain,
}: Readonly<{
  score: number;
  total: number;
  requestedTotal?: number;
  onPlayAgain: () => void;
}>) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    startTransition(async () => {
      try {
        await saveScore(score, total);
      } catch {
        setError("Couldn't save your score to the leaderboard.");
      }
    });
  }, [score, total]);

  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col items-center gap-6 text-center">
        <GameLogo className="h-12 w-20" />

        <h2 className="font-heading text-3xl font-bold">
          {copy.results.heading}
        </h2>

        <p
          className="font-heading text-6xl font-bold text-primary"
          aria-label={`${copy.results.scoreLabel} ${score} ${copy.trivia.ofLabel} ${total}`}
        >
          {score}
          <span className="text-3xl text-muted-foreground"> / {total}</span>
        </p>

        <p className="text-xl font-medium">{getReaction(score, total)}</p>

        {requestedTotal !== undefined && total < requestedTotal && (
          <p className="text-sm text-muted-foreground">
            {copy.results.shortRoundNote.replaceAll(
              "{total}",
              pluralize(total, "question"),
            )}
          </p>
        )}

        {isPending && (
          <p className="text-sm text-muted-foreground">
            {copy.leaderboard.savingButton}
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={onPlayAgain} size="lg">
            {copy.results.playAgainButton}
          </Button>
          <Button
            render={<Link href="/trivia/leaderboard?from=results" />}
            nativeButton={false}
            variant="outline"
            size="lg"
          >
            {copy.results.leaderboardButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

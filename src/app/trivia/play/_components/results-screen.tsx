"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { GameLogo } from "@/src/components/game-logo";
import { copy } from "@/src/lib/constants/copy";
import { pluralize } from "@/src/lib/helpers/pluralize";
import { saveScore } from "../_actions/save-score";
import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";

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
  roundId,
}: Readonly<{
  score: number;
  total: number;
  requestedTotal?: number;
  roundId?: string;
}>) {
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;

    startTransition(async () => {
      try {
        await saveScore(score, total, roundId);
      } catch {
        setError("Couldn't save your score to the leaderboard.");
      }
    });
  }, [score, total, roundId]);

  return (
    <GlassCard>
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

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button
          render={<Link href="/trivia/leaderboard?from=results" />}
          nativeButton={false}
          size="lg"
        >
          {copy.results.leaderboardButton}
        </Button>
      </CardContent>
    </GlassCard>
  );
}

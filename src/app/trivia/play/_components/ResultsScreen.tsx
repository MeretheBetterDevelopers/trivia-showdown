"use client";

import Link from "next/link";
import { GameLogo } from "@/src/components/GameLogo";
import { copy } from "@/src/lib/constants/copy";
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
  onPlayAgain,
}: {
  score: number;
  total: number;
  onPlayAgain: () => void;
}) {
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

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={onPlayAgain} size="lg">
            {copy.results.playAgainButton}
          </Button>
          <Button
            render={<Link href="/trivia/leaderboard" />}
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

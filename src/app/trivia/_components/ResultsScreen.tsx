"use client";

import Link from "next/link";
import { copy } from "@/src/lib/constants/copy";
import { Button } from "@/src/components/ui/button";

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
    <div className="flex flex-col items-center gap-6 text-center">
      <h2 className="font-heading text-3xl font-bold">
        {copy.results.heading}
      </h2>
      <p className="text-xl text-muted-foreground">
        {copy.results.scoreLabel}{" "}
        <span className="font-semibold text-foreground">
          {score} / {total}
        </span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button onClick={onPlayAgain} size="lg">
          {copy.results.playAgainButton}
        </Button>
        <Button
          render={<Link href="/leaderboard" />}
          nativeButton={false}
          variant="outline"
          size="lg"
        >
          {copy.results.leaderboardButton}
        </Button>
      </div>
    </div>
  );
}

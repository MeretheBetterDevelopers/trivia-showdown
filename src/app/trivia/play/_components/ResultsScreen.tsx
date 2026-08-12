"use client";

import Link from "next/link";
import { useState } from "react";
import { GameLogo } from "@/src/components/GameLogo";
import { copy } from "@/src/lib/constants/copy";
import {
  getSavedPlayerName,
  saveLeaderboardEntry,
  savePlayerName,
} from "@/src/lib/storage/leaderboard";
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
}: Readonly<{
  score: number;
  total: number;
  onPlayAgain: () => void;
}>) {
  const [name, setName] = useState(() => getSavedPlayerName());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    savePlayerName(trimmedName);
    saveLeaderboardEntry({ name: trimmedName, score, total });
    setSaved(true);
  };

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

        {saved ? (
          <p className="font-medium text-success">
            {copy.leaderboard.scoreSavedMessage}
          </p>
        ) : (
          <div className="flex w-full max-w-xs flex-wrap items-center justify-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={copy.leaderboard.nameInputPlaceholder}
              maxLength={30}
              className="min-w-0 flex-1 rounded-full border border-border bg-card/75 px-4 py-2 text-sm backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button onClick={handleSave} disabled={!name.trim()}>
              {copy.leaderboard.saveScoreButton}
            </Button>
          </div>
        )}

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

"use client";

import Link from "next/link";
import { ThemeToggle } from "@/src/app/theme/ThemeToggle";
import { Button } from "@/src/components/ui/button";
import { GameLogo } from "@/src/components/GameLogo";
import { copy } from "@/src/lib/constants/copy";

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="welcome-blob flex w-full max-w-2xl flex-col items-center gap-6 bg-muted px-10 py-16 text-center shadow-xl sm:px-16 sm:py-20">
        <GameLogo className=" w-16" />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-5xl font-bold tracking-tight uppercase sm:text-6xl">
            {copy.welcome.titlePrefix}{" "}
            <span className="text-primary">{copy.welcome.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground">{copy.welcome.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button onClick={onStart} size="lg" className="px-8 text-base">
            {copy.welcome.startButton}
          </Button>
          <Button
            render={<Link href="/leaderboard" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="px-8 text-base"
          >
            {copy.welcome.leaderboardButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

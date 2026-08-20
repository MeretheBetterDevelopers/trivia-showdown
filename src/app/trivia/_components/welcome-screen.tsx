"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { ThemeToggle } from "@/src/app/theme/theme-toggle";
import { Button } from "@/src/components/ui/button";
import { GameLogo } from "@/src/components/game-logo";
import { copy } from "@/src/lib/constants/copy";

export function WelcomeScreen({ isAdmin }: Readonly<{ isAdmin: boolean }>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-12 text-center">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {isAdmin && (
          <Button
            render={<Link href="/trivia/admin/users" />}
            nativeButton={false}
            variant="outline"
            size="icon"
            aria-label={copy.welcome.settingsLabel}
          >
            <Settings className="size-4" />
          </Button>
        )}
        <ThemeToggle />
      </div>

      <div className="welcome-blob flex w-full max-w-2xl flex-col items-center gap-6 border border-white/30 bg-muted/60 px-10 py-16 text-center shadow-xl backdrop-blur-2xl backdrop-saturate-150 sm:px-16 sm:py-20 dark:border-white/10">
        <GameLogo className=" w-16" />
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-5xl font-bold tracking-tight uppercase sm:text-6xl">
            {copy.welcome.titlePrefix}{" "}
            <span className="text-primary">{copy.welcome.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground">{copy.welcome.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            render={<Link href="/trivia/play" />}
            nativeButton={false}
            size="lg"
            className="px-8 text-base"
          >
            {copy.welcome.startButton}
          </Button>
          <Button
            render={<Link href="/trivia/leaderboard" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="px-8 text-base"
          >
            {copy.welcome.leaderboardButton}
          </Button>
        </div>
        {isAdmin && (
          <Button
            render={<Link href="/trivia/admin/questions" />}
            nativeButton={false}
            variant="ghost"
            size="lg"
            className="px-8 text-base"
          >
            {copy.welcome.createQuestionsButton}
          </Button>
        )}
      </div>
    </div>
  );
}

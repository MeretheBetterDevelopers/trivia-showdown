"use client";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { copy } from "@/src/lib/constants/copy";

export function ReadyScreen({
  onBegin,
}: Readonly<{ onBegin: () => void }>) {
  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 text-center shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-4xl font-bold">
          {copy.trivia.readyHeading}
        </h2>
        <p className="text-muted-foreground">{copy.trivia.readyTagline}</p>
        <Button onClick={onBegin} size="lg" className="px-10 text-base">
          {copy.trivia.beginButton}
        </Button>
      </CardContent>
    </Card>
  );
}

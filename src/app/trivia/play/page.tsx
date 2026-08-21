"use client";

import { useState } from "react";
import { ComingSoonScreen } from "./_components/coming-soon-screen";
import { DailyFlow } from "./_components/daily-flow";
import { GameMode, ModeSelectScreen } from "./_components/mode-select-screen";
import { NavRow } from "./_components/nav-row";
import { QuickPlayFlow } from "./_components/quick-play-flow";
import { copy } from "@/src/lib/constants/copy";

const COMING_SOON_MODE_LABELS: Record<
  Exclude<GameMode, "quick" | "daily">,
  string
> = {
  weekly: copy.trivia.weeklyLabel,
  monthly: copy.trivia.monthlyLabel,
  event: copy.trivia.eventLabel,
  room: copy.trivia.gameRoomLabel,
};

export default function Page() {
  const [mode, setMode] = useState<GameMode | null>(null);

  if (mode === null) {
    return (
      <>
        <ModeSelectScreen onSelectMode={setMode} />
        <NavRow />
      </>
    );
  }

  if (mode === "daily") {
    return <DailyFlow onBackToModes={() => setMode(null)} />;
  }

  if (mode !== "quick") {
    return (
      <>
        <ComingSoonScreen modeLabel={COMING_SOON_MODE_LABELS[mode]} />
        <NavRow onBackToModes={() => setMode(null)} />
      </>
    );
  }

  return <QuickPlayFlow onBackToModes={() => setMode(null)} />;
}

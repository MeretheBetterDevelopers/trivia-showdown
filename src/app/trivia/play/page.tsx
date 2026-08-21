"use client";

import { useState } from "react";
import { ScheduledRoundMode } from "@/src/lib/helpers/round-window";
import { ComingSoonScreen } from "./_components/coming-soon-screen";
import { GameMode, ModeSelectScreen } from "./_components/mode-select-screen";
import { NavRow } from "./_components/nav-row";
import { QuickPlayFlow } from "./_components/quick-play-flow";
import { RoundFlow } from "./_components/round-flow";
import { copy } from "@/src/lib/constants/copy";

const COMING_SOON_MODE_LABELS: Record<Extract<GameMode, "event" | "room">, string> =
  {
    event: copy.trivia.eventLabel,
    room: copy.trivia.gameRoomLabel,
  };

const SCHEDULED_ROUND_MODES: Record<
  Extract<GameMode, "daily" | "weekly" | "monthly">,
  ScheduledRoundMode
> = {
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
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

  if (mode === "daily" || mode === "weekly" || mode === "monthly") {
    return (
      <RoundFlow
        mode={SCHEDULED_ROUND_MODES[mode]}
        onBackToModes={() => setMode(null)}
      />
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

  return <QuickPlayFlow onBackToModes={() => setMode(null)} />;
}

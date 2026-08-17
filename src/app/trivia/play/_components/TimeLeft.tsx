"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import {
  LOW_TIME_THRESHOLD_SECONDS,
  QUESTION_DURATION_SECONDS,
} from "@/src/lib/constants/game";

export default function TimeLeft({
  resetKey,
  isAnswered,
  onTimeUp,
}: Readonly<{
  resetKey: number;
  isAnswered: boolean;
  onTimeUp: () => void;
}>) {
  const [trackedResetKey, setTrackedResetKey] = useState(resetKey);
  const [isLowTime, setIsLowTime] = useState(false);

  // New question: reset the color, adjusted during render (not an effect)
  // so this doesn't fight with the timers effect below.
  if (resetKey !== trackedResetKey) {
    setTrackedResetKey(resetKey);
    setIsLowTime(false);
  }

  // Two one-shot timers per question: switch to the "low time" color, and
  // report time-up. No per-second ticking — the visual countdown itself is
  // a pure CSS animation (see the element below), so nothing here needs to
  // update state every second.
  useEffect(() => {
    if (isAnswered) return;

    const lowTimeDelay =
      (QUESTION_DURATION_SECONDS - LOW_TIME_THRESHOLD_SECONDS) * 1000;
    const lowTimeId = setTimeout(() => setIsLowTime(true), lowTimeDelay);
    const timeUpId = setTimeout(onTimeUp, QUESTION_DURATION_SECONDS * 1000);

    return () => {
      clearTimeout(lowTimeId);
      clearTimeout(timeUpId);
    };
  }, [resetKey, isAnswered, onTimeUp]);

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        key={resetKey}
        className={clsx(
          "h-full rounded-full transition-colors duration-700 ease-linear",
          isLowTime ? "bg-destructive" : "bg-primary",
        )}
        style={{
          animationName: "countdown-shrink",
          animationDuration: `${QUESTION_DURATION_SECONDS}s`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
          animationPlayState: isAnswered ? "paused" : "running",
        }}
      />
    </div>
  );
}

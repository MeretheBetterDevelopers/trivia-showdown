"use client";

import { useEffect, useState } from "react";
import {
  LOW_TIME_THRESHOLD_SECONDS,
  QUESTION_DURATION_SECONDS,
} from "@/src/lib/constants/game";

export default function TimeLeft({
  isAnswered,
  onTimeUp,
}: Readonly<{
  isAnswered: boolean;
  onTimeUp: () => void;
}>) {
  const [timeLeft, setTimeLeft] = useState(QUESTION_DURATION_SECONDS);

  useEffect(() => {
    if (isAnswered) return;

    const timeoutId = setTimeout(() => {
      if (timeLeft <= 0) {
        onTimeUp();
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [timeLeft, isAnswered, onTimeUp]);

  const isLowTime = timeLeft <= LOW_TIME_THRESHOLD_SECONDS;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        className={`h-full rounded-full transition-[width,background-color] duration-1000 ease-linear ${
          isLowTime ? "bg-destructive" : "bg-primary"
        }`}
        style={{
          width: `${(timeLeft / QUESTION_DURATION_SECONDS) * 100}%`,
        }}
      />
    </div>
  );
}

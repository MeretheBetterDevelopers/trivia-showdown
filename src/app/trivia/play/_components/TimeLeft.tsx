import {
  LOW_TIME_THRESHOLD_SECONDS,
  QUESTION_DURATION_SECONDS,
} from "@/src/lib/constants/game";

export default function TimeLeft({
  timeLeft,
}: Readonly<{ timeLeft: number }>) {
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

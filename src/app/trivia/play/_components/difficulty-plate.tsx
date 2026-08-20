import { memo } from "react";
import { Questions } from "@/src/types/game/question";

const DIFFICULTY_STYLES: Record<Questions["difficulty"], string> = {
  easy: "bg-success/10 text-success",
  medium: "bg-primary/10 text-primary",
  hard: "bg-destructive/10 text-destructive",
};

function DifficultyPlate({ question }: Readonly<{ question: Questions }>) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${DIFFICULTY_STYLES[question.difficulty]}`}
    >
      {question.difficulty}
    </span>
  );
}

export default memo(DifficultyPlate);

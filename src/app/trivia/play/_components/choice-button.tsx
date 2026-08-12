import { Check, X } from "lucide-react";

const CHOICE_BADGE_COLORS = [
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-4",
];

export default function ChoiceButton({
  choice,
  index,
  isAnswered,
  isCorrectChoice,
  isSelectedChoice,
  onSelectChoice,
  badgeLetter,
}: {
  choice: string;
  index: number;
  isAnswered: boolean;
  isCorrectChoice: boolean;
  isSelectedChoice: boolean;
  onSelectChoice: (choice: string) => void;
  badgeLetter: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectChoice(choice)}
      disabled={isAnswered}
      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-medium backdrop-blur-xl backdrop-saturate-150 transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98] ${
        isAnswered && isCorrectChoice
          ? "border-success bg-success/20 text-success"
          : isAnswered && isSelectedChoice
            ? "border-destructive bg-destructive/20 text-destructive"
            : "border-white/30 bg-card/75 text-foreground dark:border-white/10"
      }`}
    >
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
          isAnswered && isCorrectChoice
            ? "bg-success"
            : isAnswered && isSelectedChoice
              ? "bg-destructive"
              : CHOICE_BADGE_COLORS[index % CHOICE_BADGE_COLORS.length]
        }`}
      >
        {isAnswered && isCorrectChoice ? (
          <Check className="size-4" />
        ) : isAnswered && isSelectedChoice ? (
          <X className="size-4" />
        ) : (
          badgeLetter
        )}
      </span>
      {choice}
    </button>
  );
}

import { Button } from "@/src/components/ui/button";
import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
import { copy } from "@/src/lib/constants/copy";
import { pluralize } from "@/src/lib/helpers/pluralize";

export function DailyResumeScreen({
  answered,
  total,
  disabled,
  onContinue,
}: Readonly<{
  answered: number;
  total: number;
  disabled?: boolean;
  onContinue: () => void;
}>) {
  return (
    <GlassCard className="text-center">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-4xl font-bold">
          {copy.trivia.dailyResumeHeading}
        </h2>
        <p className="text-muted-foreground">
          {copy.trivia.dailyResumeTagline
            .replaceAll("{answered}", String(answered))
            .replaceAll("{total}", pluralize(total, "question"))}
        </p>
        <Button
          onClick={onContinue}
          disabled={disabled}
          size="lg"
          className="px-10 text-base"
        >
          {copy.trivia.continueButton}
        </Button>
      </CardContent>
    </GlassCard>
  );
}

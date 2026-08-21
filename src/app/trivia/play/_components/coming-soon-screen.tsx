import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
import { copy } from "@/src/lib/constants/copy";

export function ComingSoonScreen({
  modeLabel,
}: Readonly<{ modeLabel: string }>) {
  return (
    <GlassCard className="text-center">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-3xl font-bold">
          {copy.trivia.comingSoonHeading}
        </h2>
        <p className="text-muted-foreground">
          {copy.trivia.comingSoonMessage.replaceAll("{mode}", modeLabel)}
        </p>
      </CardContent>
    </GlassCard>
  );
}

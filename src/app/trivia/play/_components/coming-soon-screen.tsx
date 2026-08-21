import { Card, CardContent } from "@/src/components/ui/card";
import { copy } from "@/src/lib/constants/copy";

export function ComingSoonScreen({
  modeLabel,
}: Readonly<{ modeLabel: string }>) {
  return (
    <Card className="w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 text-center shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <h2 className="font-heading text-3xl font-bold">
          {copy.trivia.comingSoonHeading}
        </h2>
        <p className="text-muted-foreground">
          {copy.trivia.comingSoonMessage.replaceAll("{mode}", modeLabel)}
        </p>
      </CardContent>
    </Card>
  );
}

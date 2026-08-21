import { CardContent } from "@/src/components/ui/card";
import { GlassCard } from "@/src/components/glass-card";
import { Spinner } from "@/src/components/ui/spinner";

export function DailyCheckingScreen() {
  return (
    <GlassCard className="text-center">
      <CardContent className="flex flex-col items-center gap-6 py-10">
        <Spinner className="size-8" />
      </CardContent>
    </GlassCard>
  );
}

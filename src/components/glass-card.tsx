import { clsx } from "clsx";
import { Card } from "@/src/components/ui/card";

export function GlassCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      className={clsx(
        "w-full max-w-2xl rounded-3xl border border-white/30 bg-card/60 shadow-xl backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10",
        className,
      )}
      {...props}
    />
  );
}

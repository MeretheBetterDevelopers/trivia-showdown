import Link from "next/link";
import { BackToHomeButton } from "@/src/components/trivia-nav-controls";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export default function EmptyLeaderboard({
  message = copy.leaderboard.emptyMessage,
}: Readonly<{ message?: string }>) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-muted-foreground">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          render={<Link href="/trivia/play" />}
          nativeButton={false}
          size="lg"
        >
          {copy.welcome.startButton}
        </Button>
        <BackToHomeButton />
      </div>
    </div>
  );
}

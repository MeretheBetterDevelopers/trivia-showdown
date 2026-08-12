import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export default function EmptyLeaderboard() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="text-muted-foreground">{copy.leaderboard.emptyMessage}</p>
      <Button
        render={<Link href="/trivia/play" />}
        nativeButton={false}
        size="lg"
      >
        {copy.welcome.startButton}
      </Button>
    </div>
  );
}

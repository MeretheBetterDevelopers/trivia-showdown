import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { copy } from "@/src/lib/constants/copy";

export default function Page() {
  return (
    <>
      <h1 className="font-heading text-3xl font-bold">
        {copy.leaderboard.heading}
      </h1>
      <p className="max-w-md text-balance text-muted-foreground">
        {copy.leaderboard.comingSoonMessage}
      </p>
      <Button
        render={<Link href="/trivia" />}
        nativeButton={false}
        variant="outline"
      >
        {copy.leaderboard.backButton}
      </Button>
    </>
  );
}

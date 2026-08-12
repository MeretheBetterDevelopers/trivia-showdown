import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="font-heading text-3xl font-bold">Leaderboard</h1>
      <p className="max-w-md text-balance text-muted-foreground">
        Coming soon — scores aren&apos;t tracked yet.
      </p>
      <Button
        render={<Link href="/trivia" />}
        nativeButton={false}
        variant="outline"
      >
        Back to Trivia Showdown
      </Button>
    </div>
  );
}

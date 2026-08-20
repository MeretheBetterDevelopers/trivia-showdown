import { prisma } from "@/src/lib/prisma";
import { copy } from "@/src/lib/constants/copy";
import EmptyLeaderboard from "./_components/empty-leaderboard";
import LeaderboardList from "./_components/leaderboard-list";
import Podium from "./_components/podium";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const cameFromResults = from === "results";
  const rows = await prisma.leaderboardEntry.findMany({
    include: { user: { select: { name: true, imageUrl: true } } },
  });

  const entries = rows.sort((a, b) => b.score / b.total - a.score / a.total);

  return (
    <>
      <h1 className="font-heading text-3xl font-bold">
        {copy.leaderboard.heading}
      </h1>

      {entries.length === 0 && <EmptyLeaderboard />}

      {entries.length > 0 && (
        <div className="flex w-full flex-col items-center gap-6">
          <Podium entries={entries} />
          <LeaderboardList entries={entries.slice(3)} startRank={4} />
          <Button
            render={<Link href="/trivia/play" />}
            nativeButton={false}
            size="lg"
          >
            {cameFromResults
              ? copy.leaderboard.playAgainButton
              : copy.leaderboard.playNowButton}
          </Button>
        </div>
      )}
    </>
  );
}

import { prisma } from "@/src/lib/prisma";
import { copy } from "@/src/lib/constants/copy";
import { getUTCDayWindow } from "@/src/lib/helpers/date-window";
import EmptyLeaderboard from "./_components/empty-leaderboard";
import LeaderboardDatePicker from "./_components/leaderboard-date-picker";
import LeaderboardList from "./_components/leaderboard-list";
import LeaderboardModeSwitcher, {
  LeaderboardView,
} from "./_components/leaderboard-mode-switcher";
import Podium from "./_components/podium";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { BackToHomeButton } from "@/src/components/trivia-nav-controls";

function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; view?: string; date?: string }>;
}) {
  const { from, view: rawView, date: rawDate } = await searchParams;
  const cameFromResults = from === "results";
  const view: LeaderboardView = rawView === "all-time" ? "all-time" : "daily";

  const today = toISODate(new Date());
  const date = rawDate ?? today;

  const { entries: rows, hasRoundForDate } =
    view === "daily"
      ? await getDailyEntries(date)
      : {
          entries: await prisma.leaderboardEntry.findMany({
            include: { user: { select: { name: true, imageUrl: true } } },
          }),
          hasRoundForDate: true,
        };

  const entries = rows.sort((a, b) => b.score / b.total - a.score / a.total);

  return (
    <>
      <h1 className="font-heading text-3xl font-bold">
        {copy.leaderboard.heading}
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <LeaderboardModeSwitcher
          view={view}
          cameFromResults={cameFromResults}
        />
        {view === "daily" && (
          <LeaderboardDatePicker
            date={date}
            cameFromResults={cameFromResults}
          />
        )}
      </div>

      {view === "daily" && !hasRoundForDate && (
        <EmptyLeaderboard message={copy.leaderboard.noDailyRoundMessage} />
      )}

      {(view !== "daily" || hasRoundForDate) && entries.length === 0 && (
        <EmptyLeaderboard />
      )}

      {entries.length > 0 && (
        <div className="flex w-full flex-col items-center gap-6">
          <Podium entries={entries} />
          <LeaderboardList entries={entries.slice(3)} startRank={4} />
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              render={<Link href="/trivia/play" />}
              nativeButton={false}
              size="lg"
            >
              {cameFromResults
                ? copy.leaderboard.playAgainButton
                : copy.leaderboard.playNowButton}
            </Button>
            <BackToHomeButton />
          </div>
        </div>
      )}
    </>
  );
}

async function getDailyEntries(date: string) {
  const { opensAt } = getUTCDayWindow(new Date(date));
  const round = await prisma.round.findFirst({
    where: { mode: "DAILY", opensAt },
    select: { id: true },
  });
  if (!round) return { entries: [], hasRoundForDate: false };

  const entries = await prisma.leaderboardEntry.findMany({
    where: { roundId: round.id },
    include: { user: { select: { name: true, imageUrl: true } } },
  });
  return { entries, hasRoundForDate: true };
}

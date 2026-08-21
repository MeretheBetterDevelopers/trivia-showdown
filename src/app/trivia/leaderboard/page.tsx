import { prisma } from "@/src/lib/prisma";
import { copy } from "@/src/lib/constants/copy";
import {
  ROUND_WINDOW,
  ScheduledRoundMode,
} from "@/src/lib/helpers/round-window";
import { LeaderboardEntryWithUser } from "@/src/types/game/leaderboard-entry";
import EmptyLeaderboard from "./_components/empty-leaderboard";
import LeaderboardDatePicker from "./_components/leaderboard-date-picker";
import LeaderboardList from "./_components/leaderboard-list";
import LeaderboardModeSwitcher, {
  LeaderboardView,
} from "./_components/leaderboard-mode-switcher";
import Podium from "./_components/podium";
import RoundPeriodPager from "./_components/round-period-pager";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { BackToHomeButton } from "@/src/components/trivia-nav-controls";

type ScheduledView = Exclude<LeaderboardView, "all-time">;

const VIEW_TO_MODE: Record<ScheduledView, ScheduledRoundMode> = {
  daily: "DAILY",
  weekly: "WEEKLY",
  monthly: "MONTHLY",
};

const EMPTY_MESSAGE: Record<ScheduledView, string> = {
  daily: copy.leaderboard.noDailyRoundMessage,
  weekly: copy.leaderboard.noWeeklyRoundMessage,
  monthly: copy.leaderboard.noMonthlyRoundMessage,
};

// Round windows are UTC calendar units (see date-window.ts) - format in
// UTC too, so the displayed label always matches the window regardless of
// the server's local timezone.
const MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

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
  const view: LeaderboardView =
    rawView === "weekly" || rawView === "monthly" || rawView === "all-time"
      ? rawView
      : "daily";

  const today = toISODate(new Date());
  const date = rawDate ?? today;
  const fromSuffix = cameFromResults ? "&from=results" : "";

  const { entries: rows, hasRoundForDate } =
    view === "all-time"
      ? { entries: await getAllTimeEntries(), hasRoundForDate: true }
      : await getRoundEntries(VIEW_TO_MODE[view], date);

  // Scoped views (daily/weekly/monthly) all share one total (the same
  // round for everyone), so this is equivalent to sorting by score alone
  // there - and for all-time, combined score is exactly what should rank.
  const entries = rows.sort((a, b) => b.score - a.score);

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
        {(view === "weekly" || view === "monthly") && (
          <RoundPeriodPager
            {...getPagerProps(
              view === "weekly" ? "WEEKLY" : "MONTHLY",
              view,
              date,
              fromSuffix,
            )}
          />
        )}
      </div>

      {view !== "all-time" && !hasRoundForDate && (
        <EmptyLeaderboard message={EMPTY_MESSAGE[view]} />
      )}

      {(view === "all-time" || hasRoundForDate) && entries.length === 0 && (
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

// All-time is a person's combined score across every round-based mode
// they've played (Daily/Weekly/Monthly/Event/Room, whatever exists) -
// grouped and summed per user. Quick Play rows (roundId null) are
// deliberately excluded: Quick Play is personal practice, not a
// leaderboard entry, even though it's still saved (for future badges).
async function getAllTimeEntries(): Promise<LeaderboardEntryWithUser[]> {
  const totals = await prisma.leaderboardEntry.groupBy({
    by: ["userId"],
    where: { roundId: { not: null } },
    _sum: { score: true },
  });
  if (totals.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: totals.map((t) => t.userId) } },
    select: { id: true, name: true, imageUrl: true },
  });
  const userById = new Map(users.map((user) => [user.id, user]));

  return totals.flatMap((t) => {
    const user = userById.get(t.userId);
    if (!user) return [];
    return [
      {
        id: t.userId,
        score: t._sum.score ?? 0,
        total: 0,
        playedAt: new Date(),
        user: { name: user.name, imageUrl: user.imageUrl },
      },
    ];
  });
}

async function getRoundEntries(mode: ScheduledRoundMode, date: string) {
  const { opensAt } = ROUND_WINDOW[mode](new Date(date));
  const round = await prisma.round.findFirst({
    where: { mode, opensAt },
    select: { id: true },
  });
  if (!round) return { entries: [], hasRoundForDate: false };

  const entries = await prisma.leaderboardEntry.findMany({
    where: { roundId: round.id },
    include: { user: { select: { name: true, imageUrl: true } } },
  });
  return { entries, hasRoundForDate: true };
}

function getPagerProps(
  mode: "WEEKLY" | "MONTHLY",
  view: "weekly" | "monthly",
  date: string,
  fromSuffix: string,
) {
  const { opensAt, closesAt } = ROUND_WINDOW[mode](new Date(date));

  const prevAnchor = new Date(opensAt);
  prevAnchor.setUTCDate(prevAnchor.getUTCDate() - 1);
  const prevHref = `/trivia/leaderboard?view=${view}&date=${toISODate(prevAnchor)}${fromSuffix}`;

  // closesAt marks the start of the next period - if that hasn't arrived
  // yet, this is still the current, ongoing period, so there's no "next".
  const nextHref =
    closesAt > new Date()
      ? null
      : `/trivia/leaderboard?view=${view}&date=${toISODate(closesAt)}${fromSuffix}`;

  const lastDay = new Date(closesAt);
  lastDay.setUTCDate(lastDay.getUTCDate() - 1);
  const label =
    mode === "WEEKLY"
      ? `${MONTH_DAY_FORMATTER.format(opensAt)} – ${MONTH_DAY_FORMATTER.format(lastDay)}`
      : MONTH_YEAR_FORMATTER.format(opensAt);

  return { label, prevHref, nextHref };
}

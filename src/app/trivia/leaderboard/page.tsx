"use client";

import { useSyncExternalStore } from "react";
import { getLeaderboardEntries } from "@/src/lib/storage/leaderboard";
import { copy } from "@/src/lib/constants/copy";
import EmptyLeaderboard from "./_components/EmptyLeaderboard";
import LeaderboardList from "./_components/LeaderboardList";
import Podium from "./_components/Podium";

const noopSubscribe = () => () => {};

export default function Page() {
  // Server and first client render must match (localStorage isn't
  // available server-side), so the real read waits for this.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const entries = mounted ? getLeaderboardEntries() : null;

  return (
    <>
      <h1 className="font-heading text-3xl font-bold">
        {copy.leaderboard.heading}
      </h1>

      {entries?.length === 0 && <EmptyLeaderboard />}

      {entries && entries.length > 0 && (
        <div className="flex w-full flex-col items-center gap-6">
          <Podium entries={entries} />
          <LeaderboardList entries={entries.slice(3)} startRank={4} />
        </div>
      )}
    </>
  );
}

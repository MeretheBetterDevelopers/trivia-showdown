export type LeaderboardEntryWithUser = {
  id: string;
  score: number;
  total: number;
  playedAt: Date;
  user: { name: string; imageUrl: string | null };
};

-- AlterTable
ALTER TABLE "LeaderboardEntry" ADD COLUMN     "answers" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "LeaderboardEntry_userId_roundId_key" ON "LeaderboardEntry"("userId", "roundId");


-- CreateEnum
CREATE TYPE "RoundMode" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'EVENT');

-- AlterTable
ALTER TABLE "LeaderboardEntry" ADD COLUMN     "roundId" TEXT;

-- CreateTable
CREATE TABLE "Round" (
    "id" TEXT NOT NULL,
    "mode" "RoundMode" NOT NULL,
    "questions" JSONB NOT NULL,
    "opensAt" TIMESTAMP(3) NOT NULL,
    "closesAt" TIMESTAMP(3) NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Round_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Round_mode_opensAt_idx" ON "Round"("mode", "opensAt");

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "Round"("id") ON DELETE SET NULL ON UPDATE CASCADE;

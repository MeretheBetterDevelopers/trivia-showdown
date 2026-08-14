/*
  Warnings:

  - You are about to drop the column `name` on the `LeaderboardEntry` table. All the data in the column will be lost.
  - Added the required column `userId` to the `LeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeaderboardEntry" DROP COLUMN "name",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LeaderboardEntry" ADD CONSTRAINT "LeaderboardEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

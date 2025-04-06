/*
  Warnings:

  - A unique constraint covering the columns `[userId,streamId,roomId]` on the table `Upvote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Upvote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Upvote_userId_streamId_key";

-- AlterTable
ALTER TABLE "Upvote" ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_streamId_roomId_key" ON "Upvote"("userId", "streamId", "roomId");

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

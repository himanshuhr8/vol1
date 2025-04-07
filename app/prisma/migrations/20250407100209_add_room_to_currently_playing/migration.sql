/*
  Warnings:

  - A unique constraint covering the columns `[roomId]` on the table `CurrentlyPlaying` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `CurrentlyPlaying` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CurrentlyPlaying_streamId_key";

-- AlterTable
ALTER TABLE "CurrentlyPlaying" ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CurrentlyPlaying_roomId_key" ON "CurrentlyPlaying"("roomId");

-- AddForeignKey
ALTER TABLE "CurrentlyPlaying" ADD CONSTRAINT "CurrentlyPlaying_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

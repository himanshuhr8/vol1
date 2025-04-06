/*
  Warnings:

  - You are about to drop the column `userId` on the `Played` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomId,streamId]` on the table `Played` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomId` to the `Played` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Played_streamId_key";

-- AlterTable
ALTER TABLE "Played" DROP COLUMN "userId",
ADD COLUMN     "roomId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Played_roomId_streamId_key" ON "Played"("roomId", "streamId");

-- AddForeignKey
ALTER TABLE "Played" ADD CONSTRAINT "Played_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Played" ADD CONSTRAINT "Played_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

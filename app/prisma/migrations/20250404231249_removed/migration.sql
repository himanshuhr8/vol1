/*
  Warnings:

  - You are about to drop the column `roomId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roomId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "roomId";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_joinedRoomId_fkey" FOREIGN KEY ("joinedRoomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

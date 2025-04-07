/*
  Warnings:

  - A unique constraint covering the columns `[extractedId,roomId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Stream_extractedId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Stream_extractedId_roomId_key" ON "Stream"("extractedId", "roomId");

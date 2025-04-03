/*
  Warnings:

  - A unique constraint covering the columns `[streamId]` on the table `Played` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Played_streamId_key" ON "Played"("streamId");

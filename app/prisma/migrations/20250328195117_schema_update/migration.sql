/*
  Warnings:

  - Added the required column `smallImg` to the `Played` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Played" ADD COLUMN     "smallImg" TEXT NOT NULL;

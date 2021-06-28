/*
  Warnings:

  - Added the required column `title` to the `exam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "exam" ADD COLUMN     "title" TEXT NOT NULL;

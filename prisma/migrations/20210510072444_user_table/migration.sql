/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `professor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `professor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "user_type" AS ENUM ('admin', 'secretary', 'professor', 'coordinator');

-- AlterTable
ALTER TABLE "professor" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "student" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "user_type" NOT NULL DEFAULT E'professor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professor_user_id_unique" ON "professor"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_unique" ON "student"("user_id");

-- AddForeignKey
ALTER TABLE "professor" ADD FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

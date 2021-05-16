/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "deletedAt",
ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterIndex
ALTER INDEX "professor_user_id_unique" RENAME TO "professor.user_id_unique";

-- AlterIndex
ALTER INDEX "student_user_id_unique" RENAME TO "student.user_id_unique";

/*
  Warnings:

  - You are about to drop the `file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_project_id_fkey";

-- RenameTable
ALTER TABLE "file" RENAME TO "project_file";

-- AlterTable
ALTER TABLE "project_file" DROP COLUMN "professor_id",
ALTER COLUMN "description" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "project_file" ADD FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterIndex
ALTER INDEX "file.deleted_at_index" RENAME TO "project_file.deleted_at_index";


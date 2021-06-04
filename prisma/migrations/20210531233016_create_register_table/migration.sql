/*
  Warnings:

  - Made the column `user_id` on table `professor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "register_type" AS ENUM ('professor', 'student');

-- DeleteProfessorWithNullUserId
DELETE FROM "professor" WHERE "user_id" IS NULL;

-- DeleteStudentWithNullUserId
DELETE FROM "student" WHERE "user_id" IS NULL;

-- AlterTable
ALTER TABLE "professor" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateTable
CREATE TABLE "register" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enrollment_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "type" "register_type" NOT NULL DEFAULT E'student',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

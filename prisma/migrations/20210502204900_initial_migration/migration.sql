-- CreateEnum
CREATE TYPE "student_class_status" AS ENUM ('approved', 'in_progress', 'reproved');

-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('active', 'in_progress', 'disabled');

-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('accepted', 'in_progress', 'rejected', 'abandoned');

-- CreateTable
CREATE TABLE "semester" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "start_period" TIMESTAMP(3) NOT NULL,
    "end_period" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "semester_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enrollment_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_tcc" (
    "id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_tcc_class" (
    "id" TEXT NOT NULL,
    "professor_tcc_id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deadline_at" TIMESTAMP(3) NOT NULL,
    "professor_tcc_class_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "file_url" TEXT,
    "exam_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_class" (
    "id" TEXT NOT NULL,
    "status" "student_class_status" NOT NULL DEFAULT E'in_progress',
    "class_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "student_class_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_report_attachment" (
    "id" TEXT NOT NULL,
    "file_url" TEXT,
    "student_report_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "student_class_id" TEXT NOT NULL,
    "professor_tcc_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_report_attachment" (
    "id" TEXT NOT NULL,
    "file_url" TEXT,
    "professor_report_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professor_advisor" (
    "id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "professor_advisor_id" TEXT NOT NULL,
    "status" "project_status" NOT NULL DEFAULT E'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "professor_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enrollment_code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" VARCHAR(15) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "status" "application_status" NOT NULL DEFAULT E'in_progress',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "semester.code_unique" ON "semester"("code");

-- CreateIndex
CREATE INDEX "semester.code_index" ON "semester"("code");

-- CreateIndex
CREATE INDEX "semester.deleted_at_index" ON "semester"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "class.code_unique" ON "class"("code");

-- CreateIndex
CREATE INDEX "class.code_index" ON "class"("code");

-- CreateIndex
CREATE INDEX "class.deleted_at_index" ON "class"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "professor.enrollment_code_unique" ON "professor"("enrollment_code");

-- CreateIndex
CREATE INDEX "professor.enrollment_code_index" ON "professor"("enrollment_code");

-- CreateIndex
CREATE INDEX "professor.deleted_at_index" ON "professor"("deleted_at");

-- CreateIndex
CREATE INDEX "professor_tcc.deleted_at_index" ON "professor_tcc"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "professor_tcc_professor_id_unique" ON "professor_tcc"("professor_id");

-- CreateIndex
CREATE INDEX "professor_tcc_class.deleted_at_index" ON "professor_tcc_class"("deleted_at");

-- CreateIndex
CREATE INDEX "exam.deleted_at_index" ON "exam"("deleted_at");

-- CreateIndex
CREATE INDEX "post.deleted_at_index" ON "post"("deleted_at");

-- CreateIndex
CREATE INDEX "student_class.deleted_at_index" ON "student_class"("deleted_at");

-- CreateIndex
CREATE INDEX "student_report.deleted_at_index" ON "student_report"("deleted_at");

-- CreateIndex
CREATE INDEX "student_report_attachment.deleted_at_index" ON "student_report_attachment"("deleted_at");

-- CreateIndex
CREATE INDEX "professor_report.deleted_at_index" ON "professor_report"("deleted_at");

-- CreateIndex
CREATE INDEX "professor_report_attachment.deleted_at_index" ON "professor_report_attachment"("deleted_at");

-- CreateIndex
CREATE INDEX "professor_advisor.deleted_at_index" ON "professor_advisor"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "professor_advisor_professor_id_unique" ON "professor_advisor"("professor_id");

-- CreateIndex
CREATE INDEX "project.deleted_at_index" ON "project"("deleted_at");

-- CreateIndex
CREATE INDEX "file.deleted_at_index" ON "file"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "student.enrollment_code_unique" ON "student"("enrollment_code");

-- CreateIndex
CREATE INDEX "student.enrollment_code_index" ON "student"("enrollment_code");

-- CreateIndex
CREATE INDEX "student.deleted_at_index" ON "student"("deleted_at");

-- CreateIndex
CREATE INDEX "application.deleted_at_index" ON "application"("deleted_at");

-- AddForeignKey
ALTER TABLE "class" ADD FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_tcc" ADD FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_tcc_class" ADD FOREIGN KEY ("professor_tcc_id") REFERENCES "professor_tcc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_tcc_class" ADD FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam" ADD FOREIGN KEY ("professor_tcc_class_id") REFERENCES "professor_tcc_class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_class" ADD FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_class" ADD FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_report" ADD FOREIGN KEY ("student_class_id") REFERENCES "student_class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_report_attachment" ADD FOREIGN KEY ("student_report_id") REFERENCES "student_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_report" ADD FOREIGN KEY ("student_class_id") REFERENCES "student_class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_report" ADD FOREIGN KEY ("professor_tcc_id") REFERENCES "professor_tcc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_report_attachment" ADD FOREIGN KEY ("professor_report_id") REFERENCES "professor_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_advisor" ADD FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD FOREIGN KEY ("professor_advisor_id") REFERENCES "professor_advisor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD FOREIGN KEY ("professor_id") REFERENCES "professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user.login_unique" ON "user"("login");

/*
  Warnings:

  - A unique constraint covering the columns `[projectId,uid]` on the table `PostReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostReaction_projectId_uid_key" ON "PostReaction"("projectId", "uid");

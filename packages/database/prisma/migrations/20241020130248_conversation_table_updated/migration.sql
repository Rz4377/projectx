/*
  Warnings:

  - A unique constraint covering the columns `[participantA,participantB]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `participantA` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participantB` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "participantA" TEXT NOT NULL,
ADD COLUMN     "participantB" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_participantA_participantB_key" ON "Conversation"("participantA", "participantB");

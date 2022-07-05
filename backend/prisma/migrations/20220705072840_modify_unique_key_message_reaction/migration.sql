/*
  Warnings:

  - The primary key for the `MessageReaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MessageReaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[messageId,userId]` on the table `MessageReaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "MessageReaction_messageId_userId_idx";

-- AlterTable
ALTER TABLE "MessageReaction" DROP CONSTRAINT "MessageReaction_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "MessageReaction_messageId_userId_key" ON "MessageReaction"("messageId", "userId");

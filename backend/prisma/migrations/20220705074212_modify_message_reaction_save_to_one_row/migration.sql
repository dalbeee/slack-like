/*
  Warnings:

  - The required column `id` was added to the `MessageReaction` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "MessageReaction_messageId_userId_key";

-- AlterTable
ALTER TABLE "MessageReaction" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "content" SET DATA TYPE TEXT,
ADD CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "MessageReaction_messageId_userId_idx" ON "MessageReaction"("messageId", "userId");

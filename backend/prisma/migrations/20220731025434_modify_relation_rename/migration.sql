-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReaction" DROP CONSTRAINT "MessageReaction_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReaction" DROP CONSTRAINT "MessageReaction_userId_fkey";

-- AddForeignKey
ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

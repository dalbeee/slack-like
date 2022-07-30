-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE', 'DIRECT_MESSAGE');

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "password" TEXT,
ADD COLUMN     "type" "ChannelType" NOT NULL DEFAULT 'PUBLIC';

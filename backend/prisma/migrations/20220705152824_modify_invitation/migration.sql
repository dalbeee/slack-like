/*
  Warnings:

  - You are about to drop the column `userId` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `inviteeUserId` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inviterUserId` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "userId",
ADD COLUMN     "inviteeUserId" TEXT NOT NULL,
ADD COLUMN     "inviterUserId" TEXT NOT NULL;

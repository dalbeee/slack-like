/*
  Warnings:

  - You are about to drop the column `inviteeUserId` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `inviteeEmail` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "inviteeUserId",
ADD COLUMN     "inviteeEmail" TEXT NOT NULL;

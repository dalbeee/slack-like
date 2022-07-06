/*
  Warnings:

  - You are about to drop the column `activationLink` on the `Invitation` table. All the data in the column will be lost.
  - Added the required column `activateCode` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "activationLink",
ADD COLUMN     "activateCode" TEXT NOT NULL;

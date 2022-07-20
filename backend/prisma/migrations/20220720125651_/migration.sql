/*
  Warnings:

  - A unique constraint covering the columns `[ancestorId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "ancestorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Message_ancestorId_key" ON "Message"("ancestorId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_ancestorId_fkey" FOREIGN KEY ("ancestorId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

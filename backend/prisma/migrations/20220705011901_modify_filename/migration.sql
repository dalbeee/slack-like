/*
  Warnings:

  - You are about to drop the column `fileSrc` on the `File` table. All the data in the column will be lost.
  - Added the required column `originalFileName` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "fileSrc",
ADD COLUMN     "originalFileName" TEXT NOT NULL;

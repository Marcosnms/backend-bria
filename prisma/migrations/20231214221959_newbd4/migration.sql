/*
  Warnings:

  - You are about to drop the column `professional` on the `basicProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "basicProfile" DROP COLUMN "professional",
ADD COLUMN     "profession" TEXT;

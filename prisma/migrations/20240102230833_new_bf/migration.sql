/*
  Warnings:

  - You are about to drop the column `educationLevel` on the `basicProfile` table. All the data in the column will be lost.
  - You are about to drop the column `profession` on the `basicProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "basicProfile" DROP COLUMN "educationLevel",
DROP COLUMN "profession";

/*
  Warnings:

  - You are about to drop the column `Member` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "Member",
ADD COLUMN     "activeConversation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "member" BOOLEAN NOT NULL DEFAULT false;

/*
  Warnings:

  - You are about to drop the column `nickname` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `userProfile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "nickname",
ALTER COLUMN "name" SET NOT NULL;

-- DropTable
DROP TABLE "userProfile";

-- CreateTable
CREATE TABLE "basicProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nickname" TEXT,
    "gender" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "age" TEXT,
    "educationLevel" TEXT,
    "professional" TEXT,

    CONSTRAINT "basicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advancedProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "profilePictureUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "language" TEXT DEFAULT 'pt-br',
    "interests" VARCHAR(900),
    "skills" VARCHAR(900),
    "professionalBackground" VARCHAR(2000),
    "industry" TEXT,
    "goals" TEXT,
    "lookingFor" TEXT,
    "offering" TEXT,
    "accountStatus" TEXT,
    "membershipStatus" TEXT,
    "bio" VARCHAR(2000),
    "website" TEXT,
    "socialMediaLinks" JSONB,
    "availability" TEXT,
    "timeCommitment" TEXT,
    "volunteerInterests" TEXT,
    "certifications" TEXT,
    "awards" TEXT,
    "publications" JSONB,
    "presentations" JSONB,
    "coursesCompleted" JSONB,
    "membershipLevel" TEXT,
    "extraPackages" JSONB,
    "referralCode" TEXT,
    "referredBy" TEXT,
    "privacySettings" JSONB,
    "customFields" JSONB,

    CONSTRAINT "advancedProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "basicProfile_userId_key" ON "basicProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "advancedProfile_userId_key" ON "advancedProfile"("userId");

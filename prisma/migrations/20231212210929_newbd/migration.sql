/*
  Warnings:

  - You are about to drop the column `activeConversation` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "activeConversation",
ADD COLUMN     "activeFlow" TEXT DEFAULT 'onboarding',
ADD COLUMN     "nickname" TEXT,
ADD COLUMN     "walletId" TEXT;

-- CreateTable
CREATE TABLE "userProfile" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT,
    "profilePictureUrl" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "language" TEXT DEFAULT 'pt-br',
    "interests" VARCHAR(900),
    "skills" VARCHAR(900),
    "educationLevel" TEXT,
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

    CONSTRAINT "userProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "providerId" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(900) NOT NULL,
    "details" VARCHAR(2000) NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tags" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(2000) NOT NULL,
    "location" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isVirtual" BOOLEAN NOT NULL,
    "maxParticipants" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" INTEGER NOT NULL,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userProfile_userId_key" ON "userProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletId_key" ON "users"("walletId");

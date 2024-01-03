-- CreateEnum
CREATE TYPE "VerificationCodeType" AS ENUM ('EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "whatsappNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "privateKey" VARCHAR(900),
    "verifiedEmail" BOOLEAN NOT NULL DEFAULT false,
    "member" BOOLEAN NOT NULL DEFAULT false,
    "walletId" TEXT,
    "activeFlow" TEXT DEFAULT 'onboarding',
    "openFlow" TEXT,
    "compliance" BOOLEAN,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUser" BOOLEAN NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdByUser" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interactions_pkey" PRIMARY KEY ("id")
);

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
    "segment" TEXT,

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

-- CreateTable
CREATE TABLE "agents" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "flow" TEXT NOT NULL,
    "thread" TEXT NOT NULL,
    "assistant" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "context" JSONB,
    "objective" TEXT,
    "expiration" TIMESTAMP(3),
    "additionalInfo" JSONB,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_whatsappNumber_key" ON "users"("whatsappNumber");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletId_key" ON "users"("walletId");

-- CreateIndex
CREATE INDEX "chats_userId_idx" ON "chats"("userId");

-- CreateIndex
CREATE INDEX "chats_createdAt_idx" ON "chats"("createdAt");

-- CreateIndex
CREATE INDEX "chats_userId_createdAt_idx" ON "chats"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "basicProfile_userId_key" ON "basicProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "advancedProfile_userId_key" ON "advancedProfile"("userId");

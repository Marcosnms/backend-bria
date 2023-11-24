-- CreateEnum
CREATE TYPE "VerificationCodeType" AS ENUM ('EMAIL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "cover" TEXT,
    "about" VARCHAR(900),
    "email" TEXT,
    "avatar" TEXT,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "privateKey" VARCHAR(900),
    "socialMedia" JSONB,
    "verifiedEmail" BOOLEAN NOT NULL DEFAULT false,
    "activeMember" BOOLEAN NOT NULL DEFAULT false,
    "whatsappNumber" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_whatsappNumber_key" ON "users"("whatsappNumber");

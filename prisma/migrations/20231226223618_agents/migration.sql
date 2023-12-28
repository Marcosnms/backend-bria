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

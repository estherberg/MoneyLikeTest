-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('CLICK', 'LIKE', 'VOTE');

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "creativeId" TEXT NOT NULL,
    "userId" TEXT,
    "itype" "InteractionType" NOT NULL,
    "metadata" JSONB,
    "ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interaction_creativeId_itype_ts_idx" ON "Interaction"("creativeId", "itype", "ts");

-- CreateIndex
CREATE UNIQUE INDEX "Interaction_userId_creativeId_itype_key" ON "Interaction"("userId", "creativeId", "itype");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[billingEmail]` on the table `Advertiser` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_advertiserId_fkey";

-- DropForeignKey
ALTER TABLE "Click" DROP CONSTRAINT "Click_creativeId_fkey";

-- DropForeignKey
ALTER TABLE "Creative" DROP CONSTRAINT "Creative_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Impression" DROP CONSTRAINT "Impression_creativeId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_creativeId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Advertiser_billingEmail_key" ON "Advertiser"("billingEmail");

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_advertiserId_fkey" FOREIGN KEY ("advertiserId") REFERENCES "Advertiser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Creative" ADD CONSTRAINT "Creative_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Impression" ADD CONSTRAINT "Impression_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Click" ADD CONSTRAINT "Click_creativeId_fkey" FOREIGN KEY ("creativeId") REFERENCES "Creative"("id") ON DELETE CASCADE ON UPDATE CASCADE;

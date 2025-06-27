-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_configId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "configId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ServiceConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

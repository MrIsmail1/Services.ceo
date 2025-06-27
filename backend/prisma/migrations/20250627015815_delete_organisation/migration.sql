/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_organizationId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP COLUMN "organizationId";

-- DropTable
DROP TABLE "Organization";

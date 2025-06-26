/*
  Warnings:

  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `advancedAttributes` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `billingPlan` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `legalVatPercent` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `locationId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `lowerPrice` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `mediaBannerId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `negotiable` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `onlineService` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `parentServiceId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `perimeter` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `supplyType` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `termsAndConditionsId` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `upperPrice` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `uptakeForm` on the `Service` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ruleset` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RulesetConstraint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RulesetInput` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[configId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `configId` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Service` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Service` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `name` to the `Service` table without a default value. This is not possible if the table is not empty.
  - Made the column `updatedAt` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Ruleset" DROP CONSTRAINT "Ruleset_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "RulesetConstraint" DROP CONSTRAINT "RulesetConstraint_rulesetId_fkey";

-- DropForeignKey
ALTER TABLE "RulesetInput" DROP CONSTRAINT "RulesetInput_rulesetId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_parentServiceId_fkey";

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "advancedAttributes",
DROP COLUMN "authorId",
DROP COLUMN "billingPlan",
DROP COLUMN "deletedAt",
DROP COLUMN "legalVatPercent",
DROP COLUMN "locationId",
DROP COLUMN "lowerPrice",
DROP COLUMN "mediaBannerId",
DROP COLUMN "negotiable",
DROP COLUMN "onlineService",
DROP COLUMN "organizationId",
DROP COLUMN "parentServiceId",
DROP COLUMN "perimeter",
DROP COLUMN "price",
DROP COLUMN "serviceId",
DROP COLUMN "state",
DROP COLUMN "summary",
DROP COLUMN "supplyType",
DROP COLUMN "tags",
DROP COLUMN "termsAndConditionsId",
DROP COLUMN "title",
DROP COLUMN "upperPrice",
DROP COLUMN "uptakeForm",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "configId" TEXT NOT NULL,
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ALTER COLUMN "updatedAt" SET NOT NULL,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "Ruleset";

-- DropTable
DROP TABLE "RulesetConstraint";

-- DropTable
DROP TABLE "RulesetInput";

-- DropEnum
DROP TYPE "ConstraintScope";

-- DropEnum
DROP TYPE "ConstraintSeverity";

-- DropEnum
DROP TYPE "InputTypeEnum";

-- DropEnum
DROP TYPE "ObjectStatus";

-- DropEnum
DROP TYPE "RulesetStatus";

-- DropEnum
DROP TYPE "ServiceBillingPlan";

-- DropEnum
DROP TYPE "ServiceSupplyForm";

-- DropEnum
DROP TYPE "ServiceUptakeType";

-- DropEnum
DROP TYPE "ServicesAcceptedDevise";

-- CreateTable
CREATE TABLE "ServiceConfig" (
    "id" TEXT NOT NULL,
    "inputSchema" JSONB NOT NULL,
    "outputSchema" JSONB NOT NULL,
    "constraints" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "userPrompt" TEXT NOT NULL,
    "uiConfig" JSONB,
    "validationRules" JSONB,
    "fallbackConfig" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceVersion" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "notes" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedById" TEXT NOT NULL,

    CONSTRAINT "ServiceVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "metadata" JSONB,
    "userId" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceVersion_serviceId_version_key" ON "ServiceVersion"("serviceId", "version");

-- CreateIndex
CREATE INDEX "Execution_serviceId_idx" ON "Execution"("serviceId");

-- CreateIndex
CREATE INDEX "Execution_userId_idx" ON "Execution"("userId");

-- CreateIndex
CREATE INDEX "Execution_status_idx" ON "Execution"("status");

-- CreateIndex
CREATE INDEX "Log_executionId_idx" ON "Log"("executionId");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Service_configId_key" ON "Service"("configId");

-- CreateIndex
CREATE INDEX "Service_slug_idx" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_category_idx" ON "Service"("category");

-- CreateIndex
CREATE INDEX "Service_createdById_idx" ON "Service"("createdById");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_configId_fkey" FOREIGN KEY ("configId") REFERENCES "ServiceConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVersion" ADD CONSTRAINT "ServiceVersion_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceVersion" ADD CONSTRAINT "ServiceVersion_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "Execution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

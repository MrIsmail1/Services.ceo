-- CreateEnum
CREATE TYPE "ObjectStatus" AS ENUM ('ONLINE', 'OFFLINE', 'DELETED');

-- CreateEnum
CREATE TYPE "ServiceBillingPlan" AS ENUM ('UNIT', 'USAGE', 'DIRECT', 'MINUTE', 'MENSUAL', 'ANNUAL');

-- CreateEnum
CREATE TYPE "ServicesAcceptedDevise" AS ENUM ('UNKNW', 'CREDIT', 'EUR', 'USD', 'GBP');

-- CreateEnum
CREATE TYPE "ServiceSupplyForm" AS ENUM ('IRL', 'ONLINE', 'MIXED');

-- CreateEnum
CREATE TYPE "ServiceUptakeType" AS ENUM ('INSTANT', 'PERIODIC', 'PRESTATION');

-- CreateEnum
CREATE TYPE "RulesetStatus" AS ENUM ('DRAFT', 'VALIDATED', 'DISABLED');

-- CreateEnum
CREATE TYPE "InputTypeEnum" AS ENUM ('TEXT', 'TEXTAREA', 'FILE', 'SELECT', 'MULTISELECT', 'BOOLEAN', 'NUMBER', 'DATE');

-- CreateEnum
CREATE TYPE "ConstraintScope" AS ENUM ('INPUT', 'OUTPUT', 'RUNTIME');

-- CreateEnum
CREATE TYPE "ConstraintSeverity" AS ENUM ('SOFT_WARNING', 'HARD_BLOCK');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "organizationId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "ownerId" TEXT,
    "legalName" VARCHAR(64),
    "brand" VARCHAR(32),
    "currency" "ServicesAcceptedDevise" NOT NULL DEFAULT 'EUR',
    "vatNumber" VARCHAR(32),
    "locationId" TEXT,
    "description" TEXT,
    "summary" TEXT,
    "advancedAttributes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("organizationId")
);

-- CreateTable
CREATE TABLE "Service" (
    "serviceId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "title" VARCHAR(64),
    "summary" VARCHAR(254),
    "description" TEXT,
    "mediaBannerId" TEXT,
    "termsAndConditionsId" TEXT,
    "parentServiceId" TEXT,
    "tags" TEXT,
    "locationId" TEXT,
    "price" INTEGER NOT NULL,
    "legalVatPercent" INTEGER NOT NULL,
    "lowerPrice" INTEGER,
    "upperPrice" INTEGER,
    "negotiable" BOOLEAN,
    "perimeter" INTEGER,
    "supplyType" "ServiceSupplyForm" NOT NULL DEFAULT 'IRL',
    "uptakeForm" "ServiceUptakeType" NOT NULL DEFAULT 'INSTANT',
    "billingPlan" "ServiceBillingPlan" NOT NULL DEFAULT 'DIRECT',
    "onlineService" BOOLEAN,
    "advancedAttributes" JSONB,
    "slug" VARCHAR(255) NOT NULL,
    "state" "ObjectStatus" NOT NULL DEFAULT 'OFFLINE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Service_pkey" PRIMARY KEY ("serviceId")
);

-- CreateTable
CREATE TABLE "Ruleset" (
    "rulesetId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "RulesetStatus" NOT NULL DEFAULT 'DRAFT',
    "aiModel" TEXT NOT NULL DEFAULT 'gpt-4',
    "contextSystem" TEXT NOT NULL,
    "instructionUser" TEXT NOT NULL,
    "promptTemplate" TEXT NOT NULL,
    "language" TEXT DEFAULT 'fr',
    "temperature" DOUBLE PRECISION DEFAULT 0.7,
    "topP" DOUBLE PRECISION DEFAULT 0.95,
    "maxTokens" INTEGER DEFAULT 1024,
    "fallbackEnabled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Ruleset_pkey" PRIMARY KEY ("rulesetId")
);

-- CreateTable
CREATE TABLE "RulesetInput" (
    "inputId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "InputTypeEnum" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "regex" TEXT,
    "options" JSONB,
    "help" TEXT,
    "position" INTEGER,

    CONSTRAINT "RulesetInput_pkey" PRIMARY KEY ("inputId")
);

-- CreateTable
CREATE TABLE "RulesetConstraint" (
    "constraintId" TEXT NOT NULL,
    "rulesetId" TEXT NOT NULL,
    "scope" "ConstraintScope" NOT NULL,
    "key" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "severity" "ConstraintSeverity" NOT NULL,

    CONSTRAINT "RulesetConstraint_pkey" PRIMARY KEY ("constraintId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ruleset_serviceId_key" ON "Ruleset"("serviceId");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_parentServiceId_fkey" FOREIGN KEY ("parentServiceId") REFERENCES "Service"("serviceId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ruleset" ADD CONSTRAINT "Ruleset_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("serviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesetInput" ADD CONSTRAINT "RulesetInput_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("rulesetId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RulesetConstraint" ADD CONSTRAINT "RulesetConstraint_rulesetId_fkey" FOREIGN KEY ("rulesetId") REFERENCES "Ruleset"("rulesetId") ON DELETE RESTRICT ON UPDATE CASCADE;

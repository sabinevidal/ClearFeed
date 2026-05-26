-- AlterTable: Add new columns with defaults for existing rows
ALTER TABLE "Pattern" ADD COLUMN "ageExplanation10" TEXT,
ADD COLUMN "ageExplanation14" TEXT,
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN "detectionSignals" TEXT[],
ADD COLUMN "riskScore" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN "whyItWorks" TEXT NOT NULL DEFAULT '';

-- Remove defaults after migration (schema enforces NOT NULL without default)
ALTER TABLE "Pattern" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Pattern" ALTER COLUMN "riskScore" DROP DEFAULT;
ALTER TABLE "Pattern" ALTER COLUMN "whyItWorks" DROP DEFAULT;

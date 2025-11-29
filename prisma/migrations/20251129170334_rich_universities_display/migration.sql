-- AlterTable
ALTER TABLE "University" ADD COLUMN     "adminEmail" TEXT,
ADD COLUMN     "adminPhone" TEXT,
ADD COLUMN     "applicationFee" DOUBLE PRECISION,
ADD COLUMN     "documentsNeeded" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "requirementsSummary" TEXT,
ADD COLUMN     "websiteUrl" TEXT;

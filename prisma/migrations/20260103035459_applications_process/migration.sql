-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "additionalEssays" TEXT[],
ADD COLUMN     "adminLastUpdated" TIMESTAMP(3),
ADD COLUMN     "adminNotes" TEXT,
ADD COLUMN     "statementOfPurpose" TEXT;

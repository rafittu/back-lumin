-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "payment_method" DROP NOT NULL,
ALTER COLUMN "total_paid" DROP NOT NULL,
ALTER COLUMN "payment_date" DROP NOT NULL;

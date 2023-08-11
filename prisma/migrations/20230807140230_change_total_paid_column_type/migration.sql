/*
  Warnings:

  - Changed the type of `payment_date` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_date",
ADD COLUMN     "payment_date" VARCHAR(10) NOT NULL;

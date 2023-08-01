/*
  Warnings:

  - You are about to drop the column `appointment_date` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[appointment_id]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointment_id` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `total_paid` on the `payments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('OPEN', 'PAID');

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "appointment_date",
ADD COLUMN     "appointment_id" UUID NOT NULL,
ADD COLUMN     "status" "PaymentStatus" NOT NULL,
DROP COLUMN "total_paid",
ADD COLUMN     "total_paid" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_appointment_id_key" ON "payments"("appointment_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

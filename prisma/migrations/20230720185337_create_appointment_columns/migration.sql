/*
  Warnings:

  - You are about to drop the column `user_id` on the `appointment_records` table. All the data in the column will be lost.
  - You are about to drop the column `scheduled_at` on the `schedules` table. All the data in the column will be lost.
  - Made the column `schedule_id` on table `appointment_records` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `appointment_date` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointment_time` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointment_records" DROP CONSTRAINT "appointment_records_schedule_id_fkey";

-- DropForeignKey
ALTER TABLE "appointment_records" DROP CONSTRAINT "appointment_records_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_id_fkey";

-- AlterTable
ALTER TABLE "appointment_records" DROP COLUMN "user_id",
ALTER COLUMN "schedule_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "scheduled_at",
ADD COLUMN     "appointment_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "appointment_time" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "appointment_records" ADD CONSTRAINT "appointment_records_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

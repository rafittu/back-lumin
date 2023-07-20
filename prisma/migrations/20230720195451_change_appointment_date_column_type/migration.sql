/*
  Warnings:

  - Changed the type of `appointment_date` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "appointment_date",
ADD COLUMN     "appointment_date" VARCHAR(10) NOT NULL;

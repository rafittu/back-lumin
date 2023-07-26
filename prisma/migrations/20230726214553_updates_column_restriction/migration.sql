/*
  Warnings:

  - A unique constraint covering the columns `[schedule_id]` on the table `appointment_records` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointment_records_schedule_id_key" ON "appointment_records"("schedule_id");

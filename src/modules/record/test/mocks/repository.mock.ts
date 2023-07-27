import { faker } from '@faker-js/faker';
import { AppointmentRecord, Scheduler } from '@prisma/client';
import { mockProfessionalId } from './controller.mock';
import { mockEncryptedRecord, mockUserAppointment } from './service.mock';
import { Record } from '../../interfaces/repository.interface';

export const mockPrismaNewRecord: AppointmentRecord = {
  id: faker.string.uuid(),
  professional_id: mockProfessionalId,
  schedule_id: mockUserAppointment.id,
  record: mockEncryptedRecord.record,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockRepositoryRecordResponse: Record = {
  id: mockPrismaNewRecord.id,
  professionalId: mockPrismaNewRecord.professional_id,
  createdAt: mockPrismaNewRecord.created_at,
};

interface PrismaProfessionalRecords extends AppointmentRecord {
  appointment: Scheduler;
}

export const mockPrismaGetProfessionalRecord: PrismaProfessionalRecords[] = [
  {
    id: mockPrismaNewRecord.id,
    professional_id: mockPrismaNewRecord.professional_id,
    schedule_id: mockPrismaNewRecord.schedule_id,
    record: mockPrismaNewRecord.record,
    created_at: mockPrismaNewRecord.created_at,
    updated_at: mockPrismaNewRecord.updated_at,
    appointment: {
      id: mockUserAppointment.id,
      client_name: mockUserAppointment.clientName,
      client_phone: mockUserAppointment.clientPhone,
      appointment_date: mockUserAppointment.appointmentDate,
      appointment_time: mockUserAppointment.appointmentTime,
      professional_id: mockPrismaNewRecord.professional_id,
      created_at: mockUserAppointment.createdAt,
      updated_at: mockUserAppointment.updatedAt,
    },
  },
];

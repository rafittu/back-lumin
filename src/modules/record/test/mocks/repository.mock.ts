import { faker } from '@faker-js/faker';
import { AppointmentRecord, Scheduler } from '@prisma/client';
import { Record } from '../../interfaces/repository.interface';
import { CreateRecordDto } from '../../dto/create-record.dto';
import { AllProfessionalRecords } from '../../interfaces/record.interface';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockEncryptedRecord: CreateRecordDto = {
  record: faker.string.sample(),
};

export const mockPrismaNewRecord: AppointmentRecord = {
  id: faker.string.uuid(),
  professional_id: mockProfessionalId,
  schedule_id: mockAppointmentId,
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
      id: mockPrismaNewRecord.schedule_id,
      client_name: faker.person.fullName(),
      client_phone: faker.phone.number(),
      appointment_date: faker.date.recent().toDateString(),
      appointment_time: faker.date.recent().toISOString().slice(11, 16),
      professional_id: mockPrismaNewRecord.professional_id,
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
    },
  },
];

export const mockAllProfessionalRecords: AllProfessionalRecords = {
  records: [
    {
      recordId: mockPrismaGetProfessionalRecord[0].id,
      clientName: mockPrismaGetProfessionalRecord[0].appointment.client_name,
      scheduledDate:
        mockPrismaGetProfessionalRecord[0].appointment.appointment_date,
      appointmentTime:
        mockPrismaGetProfessionalRecord[0].appointment.appointment_time,
      record: mockPrismaGetProfessionalRecord[0].record,
      createdAt: mockPrismaGetProfessionalRecord[0].created_at,
      updatedAt: mockPrismaGetProfessionalRecord[0].updated_at,
    },
  ],
};

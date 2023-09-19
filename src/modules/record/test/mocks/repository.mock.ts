import { faker } from '@faker-js/faker';
import { AppointmentRecord, Scheduler } from '@prisma/client';
import { Record } from '../../interfaces/repository.interface';
import { CreateRecordDto } from '../../dto/create-record.dto';
import {
  AllProfessionalRecords,
  ProfessionalRecord,
  RecordFilters,
  RecordToReencrypt,
} from '../../interfaces/record.interface';

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

export const mockPrismaGetAllProfessionalRecord: PrismaProfessionalRecords[] = [
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
      recordId: mockPrismaGetAllProfessionalRecord[0].id,
      clientName: mockPrismaGetAllProfessionalRecord[0].appointment.client_name,
      scheduledDate:
        mockPrismaGetAllProfessionalRecord[0].appointment.appointment_date,
      appointmentTime:
        mockPrismaGetAllProfessionalRecord[0].appointment.appointment_time,
      record: mockPrismaGetAllProfessionalRecord[0].record,
      createdAt: mockPrismaGetAllProfessionalRecord[0].created_at,
      updatedAt: mockPrismaGetAllProfessionalRecord[0].updated_at,
    },
  ],
};

export const mockPrismaGetOneProfessionalRecord: PrismaProfessionalRecords = {
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
};

export const mockProfessionalRecord: ProfessionalRecord = {
  recordId: mockPrismaGetOneProfessionalRecord.id,
  clientName: mockPrismaGetOneProfessionalRecord.appointment.client_name,
  scheduledDate:
    mockPrismaGetOneProfessionalRecord.appointment.appointment_date,
  appointmentTime:
    mockPrismaGetOneProfessionalRecord.appointment.appointment_time,
  record: mockPrismaGetOneProfessionalRecord.record,
  professionalId: mockPrismaGetOneProfessionalRecord.professional_id,
  createdAt: mockPrismaGetOneProfessionalRecord.created_at,
  updatedAt: mockPrismaGetOneProfessionalRecord.updated_at,
};

export const mockPrismaUpdateRecord: AppointmentRecord = {
  id: mockProfessionalRecord.recordId,
  professional_id: mockProfessionalRecord.professionalId,
  schedule_id: mockPrismaGetOneProfessionalRecord.appointment.id,
  record: mockProfessionalRecord.record,
  created_at: mockProfessionalRecord.createdAt,
  updated_at: mockProfessionalRecord.updatedAt,
};

export const mockUpdatedRecordResponse = {
  id: mockPrismaUpdateRecord.id,
  professionalId: mockPrismaUpdateRecord.professional_id,
  appointmentId: mockPrismaUpdateRecord.schedule_id,
  createdAt: mockPrismaUpdateRecord.created_at,
  updatedAt: mockPrismaUpdateRecord.updated_at,
};

export const mockRecordsToReencrypt: RecordToReencrypt = {
  id: faker.string.uuid(),
  record: faker.string.sample(),
};

export const mockRecordFilters: RecordFilters = {
  appointmentId: mockPrismaGetOneProfessionalRecord.appointment.id,
};

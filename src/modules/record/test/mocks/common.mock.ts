import { faker } from '@faker-js/faker';
import { NewRecord } from '../../interfaces/record.interface';
import { NewAppointment } from 'src/modules/scheduler/interfaces/scheduler.interface';
import { mockAppointmentId, mockProfessionalId } from './controller.mock';
import { AppointmentRecord } from '@prisma/client';
import { Record } from '../../interfaces/repository.interface';
import { CreateRecordDto } from '../../dto/create-record.dto';

export const EncryptedRecord: CreateRecordDto = {
  record: faker.string.sample(),
};

export const PrismaNewRecord: AppointmentRecord = {
  id: faker.string.uuid(),
  professional_id: mockProfessionalId,
  schedule_id: mockAppointmentId,
  record: EncryptedRecord.record,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const RepositoryRecord: Record = {
  id: PrismaNewRecord.id,
  professionalId: PrismaNewRecord.professional_id,
  createdAt: PrismaNewRecord.created_at,
};

export const mockNewRecord: NewRecord = {
  recordId: RepositoryRecord.id,
  clientName: faker.person.fullName(),
  scheduledDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  createdAt: RepositoryRecord.createdAt,
};

export const mockUserAppointment: NewAppointment = {
  id: mockAppointmentId,
  professionalId: mockProfessionalId,
  clientName: mockNewRecord.clientName,
  clientPhone: faker.phone.number(),
  appointmentDate: mockNewRecord.scheduledDate,
  appointmentTime: mockNewRecord.appointmentTime,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

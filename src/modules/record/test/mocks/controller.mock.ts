import { faker } from '@faker-js/faker';
import { CreateRecordDto } from '../../dto/create-record.dto';
import {
  AllProfessionalRecords,
  NewRecord,
  ProfessionalRecord,
} from '../../interfaces/record.interface';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockCreateRecord: CreateRecordDto = {
  record: faker.string.sample(),
};

export const mockNewRecord: NewRecord = {
  recordId: faker.string.uuid(),
  clientName: faker.person.fullName(),
  scheduledDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  createdAt: faker.date.recent(),
};

export const mockProfessionalRecord: ProfessionalRecord = {
  recordId: mockNewRecord.recordId,
  clientName: mockNewRecord.clientName,
  scheduledDate: mockNewRecord.scheduledDate,
  appointmentTime: mockNewRecord.appointmentTime,
  record: mockCreateRecord.record,
  createdAt: mockNewRecord.createdAt,
  updatedAt: faker.date.recent(),
};

export const mockAllProfessionalRecords: AllProfessionalRecords = {
  records: [mockProfessionalRecord],
};

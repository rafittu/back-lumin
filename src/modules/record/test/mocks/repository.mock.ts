import { faker } from '@faker-js/faker';
import { AppointmentRecord } from '@prisma/client';
import { mockAppointmentId, mockProfessionalId } from './controller.mock';
import { mockEncryptedRecord } from './service.mock';
import { Record } from '../../interfaces/repository.interface';

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

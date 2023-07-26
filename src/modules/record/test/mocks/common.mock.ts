import { faker } from '@faker-js/faker';
import { NewRecord } from '../../interfaces/record.interface';
import { mockRepositoryRecordResponse } from './repository.mock';

export const mockNewRecord: NewRecord = {
  recordId: mockRepositoryRecordResponse.id,
  clientName: faker.person.fullName(),
  scheduledDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  createdAt: mockRepositoryRecordResponse.createdAt,
};

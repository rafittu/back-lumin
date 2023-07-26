import { faker } from '@faker-js/faker';
import { NewRecord } from '../../interfaces/record.interface';

export const mockNewRecord: NewRecord = {
  recordId: faker.string.uuid(),
  clientName: faker.person.fullName(),
  scheduledDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  createdAt: faker.date.recent(),
};

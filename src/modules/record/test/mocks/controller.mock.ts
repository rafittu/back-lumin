import { faker } from '@faker-js/faker';
import { CreateRecordDto } from '../../dto/create-record.dto';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockCreateRecord: CreateRecordDto = {
  record: faker.string.sample(),
};

import { faker } from '@faker-js/faker';
import { CreateRecordDto } from '../../dto/create-record.dto';

export const mockEncryptedRecord: CreateRecordDto = {
  record: faker.string.sample(),
};

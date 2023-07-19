import { faker } from '@faker-js/faker';
import { UserCredentials } from '../../interfaces/auth.interface';

export const mockAccessToken = faker.string.alphanumeric();

export const mockUserCredentials: UserCredentials = {
  email: faker.internet.email(),
  password: faker.internet.password(),
};

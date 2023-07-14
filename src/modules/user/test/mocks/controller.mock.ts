import { faker } from '@faker-js/faker';
import { CreateUserDto } from '../../dto/create-user.dto';
import {
  Client,
  ProfessionalClients,
  UpdatedUser,
  User,
  UserData,
} from '../../interfaces/user.interface';
import { UserRole } from '../../enum/user-role.enum';
import { UpdateUserDto } from '../../dto/update-user.dto';

export const mockAccessToken = faker.string.alphanumeric();

export const mockCreateUserBody: CreateUserDto = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  socialName: faker.person.fullName(),
  username: faker.internet.userName(),
  bornDate: faker.date.birthdate().toISOString().split('T')[0],
  motherName: faker.person.fullName({ sex: 'female' }),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  password: '@Password123',
  passwordConfirmation: '@Password123',
};

export const mockNewAdminUser: User = {
  id: faker.string.uuid(),
  almaId: faker.string.uuid(),
  name: faker.person.fullName({ sex: 'male' }),
  socialName: faker.person.firstName('female'),
  email: faker.internet.email(),
  role: UserRole.ADMIN,
};

export const mockNewClientUser: User = {
  id: faker.string.uuid(),
  almaId: faker.string.uuid(),
  name: faker.person.fullName({ sex: 'male' }),
  socialName: faker.person.firstName('female'),
  email: faker.internet.email(),
  role: UserRole.CLIENT,
};

export const mockUserData: UserData = {
  id: mockNewClientUser.id,
  name: mockNewClientUser.name,
  socialName: mockNewClientUser.socialName,
  bornDate: faker.date.birthdate().toISOString().split('T')[0],
  motherName: faker.person.fullName({ sex: 'female' }),
  username: faker.internet.userName(),
  email: mockNewClientUser.email,
  phone: faker.phone.number(),
  status: faker.string.sample(),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

const mockClient: Client = {
  id: mockUserData.id,
  name: mockUserData.name,
  phone: mockUserData.phone,
};

export const mockProfessionalClients: ProfessionalClients = {
  professionalId: mockNewAdminUser.id,
  clients: [mockClient],
};

export const mockUpdateUser: UpdateUserDto = {
  username: faker.internet.userName(),
};

export const mockUpdatedUser: UpdatedUser = {
  id: mockUserData.id,
  personal: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    socialName: faker.person.fullName(),
    updatedAt: faker.date.recent(),
  },
  contact: {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    updatedAt: faker.date.recent(),
  },
  security: {
    status: faker.string.sample(),
    updatedAt: faker.date.recent(),
  },
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

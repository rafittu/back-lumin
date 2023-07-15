import { faker } from '@faker-js/faker';
import { AlmaUser } from '../../interfaces/repository.interface';
import { User } from '@prisma/client';
import * as Interfaces from '../../interfaces/user.interface';
import { UserRole } from '../../enum/user-role.enum';
import { mockCreateUserBody } from './controller.mock';

export const mockAlmaUser: AlmaUser = {
  id: faker.string.uuid(),
  personal: {
    id: faker.string.uuid(),
    firstName: mockCreateUserBody.firstName,
    socialName: mockCreateUserBody.socialName,
  },
  contact: {
    id: faker.string.uuid(),
    username: mockCreateUserBody.username,
    email: mockCreateUserBody.email,
  },
  security: {
    id: faker.string.uuid(),
    status: faker.string.sample(),
  },
  createdAt: faker.date.recent().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
};

export const mockPrismaCreatedUser: User = {
  id: faker.string.uuid(),
  alma_id: mockAlmaUser.id,
  name: mockAlmaUser.personal.firstName,
  social_name: mockAlmaUser.personal.socialName,
  role: UserRole.CLIENT,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockNewUser: Interfaces.User = {
  id: mockPrismaCreatedUser.id,
  almaId: mockPrismaCreatedUser.alma_id,
  name: mockPrismaCreatedUser.name,
  socialName: mockPrismaCreatedUser.social_name,
  email: mockAlmaUser.contact.email,
  role: UserRole.CLIENT,
  createdAt: mockPrismaCreatedUser.created_at,
  updatedAt: mockPrismaCreatedUser.updated_at,
};

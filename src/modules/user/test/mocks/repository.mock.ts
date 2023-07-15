import { faker } from '@faker-js/faker';
import { AlmaUser, AlmaUserData } from '../../interfaces/repository.interface';
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
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const mockPrismaUser: User = {
  id: faker.string.uuid(),
  alma_id: mockAlmaUser.id,
  name: mockAlmaUser.personal.firstName,
  social_name: mockAlmaUser.personal.socialName,
  role: UserRole.CLIENT,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockNewUser: Interfaces.User = {
  id: mockPrismaUser.id,
  almaId: mockPrismaUser.alma_id,
  name: mockPrismaUser.name,
  socialName: mockPrismaUser.social_name,
  email: mockAlmaUser.contact.email,
  role: UserRole.CLIENT,
  createdAt: mockPrismaUser.created_at,
  updatedAt: mockPrismaUser.updated_at,
};

export const mockAlmaUserData: AlmaUserData = {
  id: faker.string.uuid(),
  personal: {
    id: faker.string.uuid(),
    firstName: mockAlmaUser.personal.firstName,
    lastName: mockCreateUserBody.lastName,
    socialName: mockAlmaUser.personal.socialName,
    bornDate: mockCreateUserBody.bornDate,
    motherName: mockCreateUserBody.motherName,
    updatedAt: faker.date.recent(),
  },
  contact: {
    id: faker.string.uuid(),
    username: mockAlmaUser.contact.username,
    email: mockAlmaUser.contact.email,
    phone: mockCreateUserBody.phone,
    updatedAt: faker.date.recent(),
  },
  security: {
    id: faker.string.uuid(),
    status: mockAlmaUser.security.status,
    updatedAt: faker.date.recent(),
  },
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const getUser: Interfaces.UserData = {
  id: mockPrismaUser.id,
  name: mockPrismaUser.name,
  socialName: mockPrismaUser.social_name,
  bornDate: mockAlmaUserData.personal.bornDate,
  motherName: mockAlmaUserData.personal.motherName,
  username: mockAlmaUserData.contact.username,
  email: mockAlmaUserData.contact.email,
  phone: mockAlmaUserData.contact.phone,
  status: mockAlmaUserData.security.status,
  createdAt: mockPrismaUser.created_at,
  updatedAt: mockPrismaUser.updated_at,
};

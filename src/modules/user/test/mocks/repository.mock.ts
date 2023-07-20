import { faker } from '@faker-js/faker';
import { AlmaUser, AlmaUserData } from '../../interfaces/repository.interface';
import { AppointmentRecord, Scheduler, User } from '@prisma/client';
import * as Interfaces from '../../interfaces/user.interface';
import { UserRole } from '../../enum/user-role.enum';
import { mockCreateUserBody } from './controller.mock';
import { UpdateUserDto } from '../../dto/update-user.dto';

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

export const mockGetUser: Interfaces.UserData = {
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

interface PrismaProfessionalClient extends AppointmentRecord {
  appointment: Scheduler;
}

export const mockGetProfessionalClient: PrismaProfessionalClient[] = [
  {
    id: faker.string.uuid(),
    professional_id: faker.string.uuid(),
    schedule_id: faker.string.uuid(),
    actual_date: faker.date.recent(),
    record: faker.string.sample(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    appointment: {
      id: faker.string.uuid(),
      client_name: faker.person.fullName(),
      client_phone: faker.phone.number(),
      appointment_date: faker.date.recent(),
      appointment_time: faker.date.recent().toISOString().slice(11, 16),
      professional_id: faker.string.uuid(),
      created_at: faker.date.recent(),
      updated_at: faker.date.recent(),
    },
  },
];

export const mockProfessionalClients: Interfaces.ProfessionalClients = {
  professionalId: mockGetProfessionalClient[0].id,
  clients: [
    {
      id: mockGetProfessionalClient[0].appointment.id,
      name: mockGetProfessionalClient[0].appointment.client_name,
      phone: mockGetProfessionalClient[0].appointment.client_phone,
    },
  ],
};

export const mockUserDataToUpdate: UpdateUserDto = {
  socialName: faker.person.fullName(),
};

export const mockCreateUserAxiosResponse = {
  data: {
    mockAlmaUser,
  },
};

export const mockGetUserAxiosResponse = {
  data: {
    mockAlmaUserData,
  },
};

export const mockUpdateUserAxiosResponse = {
  data: {
    mockAlmaUserData,
  },
};

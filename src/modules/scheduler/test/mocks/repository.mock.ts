import { faker } from '@faker-js/faker';
import { Scheduler } from '@prisma/client';
import {
  mockCreateAppointment,
  mockProfessionalId,
  mockUpdateAppointment,
} from './controller.mock';

export const mockPrismaNewAppointment: Scheduler = {
  id: faker.string.uuid(),
  professional_id: mockProfessionalId,
  client_name: mockCreateAppointment.clientName,
  client_phone: mockCreateAppointment.clientPhone,
  appointment_date: mockCreateAppointment.appointmentDate,
  appointment_time: mockCreateAppointment.appointmentTime,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockPrismaProfessionalAppointments: Scheduler[] = [
  {
    ...mockPrismaNewAppointment,
  },
];

export const mockPrismaUpdateAppointment: Scheduler = {
  ...mockPrismaNewAppointment,
  appointment_date: mockUpdateAppointment.appointmentDate,
  appointment_time: mockUpdateAppointment.appointmentTime,
};

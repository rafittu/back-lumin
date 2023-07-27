import { faker } from '@faker-js/faker';
import { CreateRecordDto } from '../../dto/create-record.dto';
import {
  Appointment,
  ProfessionalAppointments,
} from '../../../../modules/scheduler/interfaces/scheduler.interface';
import { mockAppointmentId, mockProfessionalId } from './controller.mock';

export const mockEncryptedRecord: CreateRecordDto = {
  record: faker.string.sample(),
};

export const mockUserAppointment: Appointment = {
  id: mockAppointmentId,
  professionalId: mockProfessionalId,
  clientName: faker.person.fullName(),
  clientPhone: faker.phone.number(),
  appointmentDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const mockProfessionalAppointments: ProfessionalAppointments = {
  appointments: [mockUserAppointment],
};

export const mockFutureAppointment: ProfessionalAppointments = {
  appointments: [
    {
      ...mockUserAppointment,
      appointmentDate: faker.date.future().toLocaleDateString(),
    },
  ],
};

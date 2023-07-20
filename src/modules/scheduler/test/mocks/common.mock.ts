import { faker } from '@faker-js/faker';
import { NewAppointment } from '../../interfaces/appointment.interface';
import { mockCreateAppointment, mockProfessionalId } from './controller.mock';

export const mockNewAppointment: NewAppointment = {
  id: faker.string.uuid(),
  professionalId: mockProfessionalId,
  clientName: mockCreateAppointment.clientName,
  clientPhone: mockCreateAppointment.clientPhone,
  appointmentDate: mockCreateAppointment.appointmentDate,
  appointmentTime: mockCreateAppointment.appointmentTime,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

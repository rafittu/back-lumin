import { faker } from '@faker-js/faker';
import { NewRecord } from '../../interfaces/record.interface';
import { mockRepositoryRecordResponse } from './repository.mock';
import {
  Appointment,
  ProfessionalAppointments,
} from '../../../../modules/scheduler/interfaces/scheduler.interface';
import { mockAppointmentId, mockProfessionalId } from './controller.mock';

export const mockNewRecord: NewRecord = {
  recordId: mockRepositoryRecordResponse.id,
  clientName: faker.person.fullName(),
  scheduledDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  createdAt: mockRepositoryRecordResponse.createdAt,
};

export const mockUserAppointment: Appointment = {
  id: mockAppointmentId,
  professionalId: mockProfessionalId,
  clientName: mockNewRecord.clientName,
  clientPhone: faker.phone.number(),
  appointmentDate: mockNewRecord.scheduledDate,
  appointmentTime: mockNewRecord.appointmentTime,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const mockProfessionalAppointments: ProfessionalAppointments = {
  appointments: [mockUserAppointment],
};

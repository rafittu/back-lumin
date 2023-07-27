import { faker } from '@faker-js/faker';
import {
  AllProfessionalRecords,
  NewRecord,
  ProfessionalRecord,
} from '../../interfaces/record.interface';
import {
  mockPrismaNewRecord,
  mockRepositoryRecordResponse,
} from './repository.mock';
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

export const mockFutureAppointment: ProfessionalAppointments = {
  appointments: [
    {
      ...mockUserAppointment,
      appointmentDate: faker.date.future().toLocaleDateString(),
    },
  ],
};

export const mockProfessionalRecord: ProfessionalRecord = {
  recordId: mockRepositoryRecordResponse.id,
  clientName: faker.person.fullName(),
  scheduledDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
  record: faker.string.sample(),
  createdAt: mockRepositoryRecordResponse.createdAt,
  updatedAt: mockPrismaNewRecord.updated_at,
};

export const mockAllProfessionalRecords: AllProfessionalRecords = {
  records: [mockProfessionalRecord],
};

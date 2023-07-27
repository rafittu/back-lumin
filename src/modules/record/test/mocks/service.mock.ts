import { faker } from '@faker-js/faker';
import { CreateRecordDto } from '../../dto/create-record.dto';
import {
  Appointment,
  ProfessionalAppointments,
} from '../../../../modules/scheduler/interfaces/scheduler.interface';
import { mockAppointmentId, mockProfessionalId } from './controller.mock';
import { mockNewRecord } from './common.mock';

export const mockEncryptedRecord: CreateRecordDto = {
  record: faker.string.sample(),
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

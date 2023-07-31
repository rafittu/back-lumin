import { faker } from '@faker-js/faker';
import { CreateRecordDto } from '../../dto/create-record.dto';
import {
  Appointment,
  ProfessionalAppointments,
} from '../../../../modules/scheduler/interfaces/scheduler.interface';
import {
  AllProfessionalRecords,
  NewRecord,
  ProfessionalRecord,
} from '../../interfaces/record.interface';
import { Record } from '../../interfaces/repository.interface';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockCreateRecord: CreateRecordDto = {
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

export const mockRepositoryRecordResponse: Record = {
  id: faker.string.uuid(),
  professionalId: mockUserAppointment.professionalId,
  createdAt: faker.date.recent(),
};

export const mockNewRecord: NewRecord = {
  recordId: mockRepositoryRecordResponse.id,
  clientName: mockUserAppointment.clientName,
  scheduledDate: mockUserAppointment.appointmentDate,
  appointmentTime: mockUserAppointment.appointmentTime,
  createdAt: mockRepositoryRecordResponse.createdAt,
};

export const mockProfessionalRecord: ProfessionalRecord = {
  recordId: mockNewRecord.recordId,
  clientName: mockNewRecord.clientName,
  scheduledDate: mockNewRecord.scheduledDate,
  appointmentTime: mockNewRecord.appointmentTime,
  record: mockCreateRecord.record,
  createdAt: mockNewRecord.createdAt,
  updatedAt: faker.date.recent(),
};

export const mockAllProfessionalRecords: AllProfessionalRecords = {
  records: [mockProfessionalRecord],
};

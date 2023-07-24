import { faker } from '@faker-js/faker';
import { CreateAppointmentDto } from '../../dto/create-scheduler.dto';
import { UpdateAppointmentDto } from '../../dto/update-schedule.dto';

export const mockProfessionalId = faker.string.uuid();

export const mockCreateAppointment: CreateAppointmentDto = {
  clientName: faker.person.fullName(),
  clientPhone: faker.phone.number(),
  appointmentDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
};

export const mockUpdateAppointment: UpdateAppointmentDto = {
  appointmentDate: faker.date.recent().toLocaleDateString(),
  appointmentTime: faker.date.recent().toISOString().slice(11, 16),
};

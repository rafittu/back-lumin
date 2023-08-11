import { faker } from '@faker-js/faker';
import { CreateAppointmentDto } from '../../dto/create-scheduler.dto';
import { UpdateAppointmentDto } from '../../dto/update-schedule.dto';

export const mockProfessionalId = faker.string.uuid();

export const mockCreateAppointment: CreateAppointmentDto = {
  clientName: faker.person.fullName(),
  clientPhone: faker.phone.number(),
  appointmentDate: faker.date.future().toISOString().slice(0, 10),
  appointmentTime: faker.date.future().toISOString().slice(11, 16),
};

export const mockUpdateAppointment: UpdateAppointmentDto = {
  appointmentDate: faker.date.future().toISOString().slice(0, 10),
  appointmentTime: faker.date.future().toISOString().slice(11, 16),
};

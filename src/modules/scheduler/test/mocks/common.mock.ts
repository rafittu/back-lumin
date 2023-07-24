import {
  Appointment,
  NewAppointment,
  ProfessionalAppointments,
} from '../../interfaces/scheduler.interface';
import { mockPrismaNewAppointment } from './repository.mock';
import { mockUpdateAppointment } from './controller.mock';

export const mockNewAppointment: NewAppointment = {
  id: mockPrismaNewAppointment.id,
  professionalId: mockPrismaNewAppointment.professional_id,
  clientName: mockPrismaNewAppointment.client_name,
  clientPhone: mockPrismaNewAppointment.client_phone,
  appointmentDate: mockPrismaNewAppointment.appointment_date,
  appointmentTime: mockPrismaNewAppointment.appointment_time,
  createdAt: mockPrismaNewAppointment.created_at,
  updatedAt: mockPrismaNewAppointment.updated_at,
};

export const mockProfessionalAppointments: ProfessionalAppointments = {
  appointments: [mockNewAppointment],
};

export const mockUpdatedAppointment: Appointment = {
  id: mockNewAppointment.id,
  professionalId: mockNewAppointment.professionalId,
  clientName: mockNewAppointment.clientName,
  clientPhone: mockNewAppointment.clientPhone,
  appointmentDate: mockUpdateAppointment.appointmentDate,
  appointmentTime: mockUpdateAppointment.appointmentTime,
  createdAt: mockNewAppointment.createdAt,
  updatedAt: mockNewAppointment.updatedAt,
};

import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
import { UpdateAppointmentDto } from '../dto/update-schedule.dto';
import {
  AppointmentFilters,
  NewAppointment,
  ProfessionalAppointments,
} from './scheduler.interface';

export interface ISchedulerRepository {
  createAppointment(
    professionalId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<NewAppointment>;
  findAllAppointments(
    professionalId: string,
  ): Promise<ProfessionalAppointments>;
  getApptByFilter(
    professionalId: string,
    filter: AppointmentFilters,
  ): Promise<ProfessionalAppointments>;
  updateAppointment(
    appointmentId: string,
    updateAppointment: UpdateAppointmentDto,
  );
}

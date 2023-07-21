import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
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
}

import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
import { NewAppointment } from './scheduler.interface';

export interface ISchedulerRepository {
  createAppointment(
    professionalId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<NewAppointment>;
  findAllAppointments(professionalId: string);
}

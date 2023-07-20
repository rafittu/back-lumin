import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
import { NewAppointment } from './appointment.interface';

export interface ISchedulerRepository {
  createAppointment(
    professionalId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<NewAppointment>;
}

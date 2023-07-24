import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { AppError } from '../../../common/errors/Error';
import { UpdateAppointmentDto } from '../dto/update-schedule.dto';

@Injectable()
export class UpdateAppointmentService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(
    appointmentId: string,
    professionalId: string,
    updateAppointment: UpdateAppointmentDto,
  ) {
    const { appointmentDate, appointmentTime } = updateAppointment;

    if (!professionalId) {
      throw new AppError(
        'appt-module.updateAppointment',
        400,
        'missing query parameter [professionalId]',
      );
    }

    const apptToUpdate = await this.schedulerRepository.getApptByFilter(
      professionalId,
      { appointmentId },
    );

    const isTimeAvailable = await this.schedulerRepository.getApptByFilter(
      professionalId,
      {
        appointmentDate:
          appointmentDate ?? apptToUpdate.appointments[0].appointmentDate,
        appointmentTime:
          appointmentTime ?? apptToUpdate.appointments[0].appointmentTime,
      },
    );

    if (isTimeAvailable.appointments.length) {
      throw new AppError(
        'appt-module.updateAppointment',
        409,
        'appointment time already booked for another client',
      );
    }

    return await this.schedulerRepository.updateAppointment(
      appointmentId,
      updateAppointment,
    );
  }
}

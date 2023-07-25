import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { DeletedAppointment } from '../interfaces/scheduler.interface';

@Injectable()
export class DeleteAppointmentService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(appointmentId: string): Promise<DeletedAppointment> {
    return await this.schedulerRepository.deleteAppointment(appointmentId);
  }
}

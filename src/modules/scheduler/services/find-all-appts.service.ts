import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';

@Injectable()
export class FindAllAppointmentService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(professionalId: string) {
    return await this.schedulerRepository.findAllAppointments(professionalId);
  }
}

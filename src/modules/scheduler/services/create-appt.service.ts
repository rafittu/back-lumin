import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';

@Injectable()
export class CreateAppointmmentService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(newAppointmment) {
    return await this.schedulerRepository.createAppointmment(newAppointmment);
  }
}

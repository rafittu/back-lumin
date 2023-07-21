import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { ProfessionalAppointments } from '../interfaces/scheduler.interface';

@Injectable()
export class FindAllAppointmentService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(professionalId: string): Promise<ProfessionalAppointments> {
    return await this.schedulerRepository.findAllAppointments(professionalId);
  }
}

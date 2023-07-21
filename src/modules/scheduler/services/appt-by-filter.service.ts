import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';
import {
  AppointmentFilters,
  ProfessionalAppointments,
} from '../interfaces/scheduler.interface';

@Injectable()
export class GetAppointmentByFilterService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(
    professionalId: string,
    filter: AppointmentFilters,
  ): Promise<ProfessionalAppointments> {
    return await this.schedulerRepository.getApptByFilter(
      professionalId,
      filter,
    );
  }
}

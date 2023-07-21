import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
import { NewAppointment } from '../interfaces/scheduler.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class CreateAppointmentService {
  constructor(
    @Inject(SchedulerRepository)
    private schedulerRepository: ISchedulerRepository,
  ) {}

  async execute(
    professionalId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<NewAppointment> {
    if (!professionalId) {
      throw new AppError(
        'appt-module.createAppointment',
        400,
        'missing query parameter [professionalId]',
      );
    }
    return await this.schedulerRepository.createAppointment(
      professionalId,
      createAppointmentDto,
    );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
import { NewAppointment } from '../interfaces/appointment.interface';

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
    return await this.schedulerRepository.createAppointment(
      professionalId,
      createAppointmentDto,
    );
  }
}

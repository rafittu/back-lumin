import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { ISchedulerRepository } from '../interfaces/repository.interface';

@Injectable()
export class SchedulerRepository implements ISchedulerRepository {
  constructor(private prisma: PrismaService) {}

  async createAppointment(professionalId, createAppointmentDto) {
    const { clientName, clientPhone, appointmentDate, appointmentTime } =
      createAppointmentDto;

    try {
      const existingScheduler = await this.prisma.scheduler.findFirst({
        where: {
          professional_id: professionalId,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        },
      });

      if (existingScheduler) {
        throw new AppError(
          'scheduler-repository.createAppt',
          409,
          'an appointment already exists at this time',
        );
      }

      const appointment = await this.prisma.scheduler.create({
        data: {
          professional_id: professionalId,
          client_name: clientName,
          client_phone: clientPhone,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
        },
      });

      const { id, created_at, updated_at } = appointment;
      const apptResponse = {
        id,
        professionalId,
        ...createAppointmentDto,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return apptResponse;
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(
          'appointment-repository.createAppointment',
          error.code,
          error.message,
        );
      }

      throw new AppError(
        'scheduler-repository.createAppt',
        500,
        'failed to create appointment',
      );
    }
  }
}

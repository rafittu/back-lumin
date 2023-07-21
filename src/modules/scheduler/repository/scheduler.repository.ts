import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { ISchedulerRepository } from '../interfaces/repository.interface';
import { CreateAppointmentDto } from '../dto/create-scheduler.dto';
import {
  AppointmentFilters,
  NewAppointment,
  ProfessionalAppointments,
} from '../interfaces/scheduler.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class SchedulerRepository implements ISchedulerRepository {
  constructor(private prisma: PrismaService) {}

  async createAppointment(
    professionalId: string,
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<NewAppointment> {
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

  async findAllAppointments(
    professionalId: string,
  ): Promise<ProfessionalAppointments> {
    try {
      const currentDate = new Date().toISOString().slice(0, 10);

      const appointments = await this.prisma.scheduler.findMany({
        where: {
          professional_id: professionalId,
          appointment_date: {
            gte: currentDate,
          },
        },
      });

      const apptsResponse = appointments.map((appointment) => ({
        id: appointment.id,
        professionalId: appointment.professional_id,
        clientName: appointment.client_name,
        clientPhone: appointment.client_phone,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at,
      }));

      return {
        appointments: apptsResponse,
      };
    } catch (error) {
      throw new AppError(
        'scheduler-repository.findAllAppts',
        500,
        'failed to get appointments',
      );
    }
  }

  async getApptByFilter(
    professionalId: string,
    filter: AppointmentFilters,
  ): Promise<ProfessionalAppointments> {
    const { clientName, appointmentDate, appointmentTime } = filter;

    try {
      const appointmentQuery: Prisma.SchedulerWhereInput = {
        professional_id: professionalId,
      };

      clientName
        ? (appointmentQuery.client_name = clientName)
        : appointmentQuery;

      appointmentDate
        ? (appointmentQuery.appointment_date = appointmentDate)
        : appointmentQuery;

      appointmentTime
        ? (appointmentQuery.appointment_time = appointmentTime)
        : appointmentQuery;

      const appointments = await this.prisma.scheduler.findMany({
        where: appointmentQuery,
      });

      const apptsResponse = appointments.map((appointment) => ({
        id: appointment.id,
        professionalId: appointment.professional_id,
        clientName: appointment.client_name,
        clientPhone: appointment.client_phone,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        createdAt: appointment.created_at,
        updatedAt: appointment.updated_at,
      }));

      return {
        appointments: apptsResponse,
      };
    } catch (error) {
      throw new AppError(
        'scheduler-repository.getApptByFilter',
        500,
        'failed to get appointment',
      );
    }
  }
}

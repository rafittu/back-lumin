import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IRecordRepository, Record } from '../interfaces/repository.interface';
import { CreateRecordDto } from '../dto/create-record.dto';
import { AppError } from '../../../common/errors/Error';
import { Prisma } from '@prisma/client';
import { AllProfessionalRecords } from '../interfaces/record.interface';

@Injectable()
export class RecordRepository implements IRecordRepository {
  constructor(private prisma: PrismaService) {}

  async createRecord(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  ): Promise<Record> {
    try {
      const newRecord = await this.prisma.appointmentRecord.create({
        data: {
          professional_id: professionalId,
          schedule_id: appointmentId,
          record: createRecordDto.record,
        },
      });

      const { id, created_at } = newRecord;
      const recordResponde = {
        id,
        professionalId,
        createdAt: created_at,
      };

      return recordResponde;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError(
          `record-repository.createRecord`,
          409,
          'a record for this appointment already exists',
        );
      }

      throw new AppError(
        'record-repository.createRecord',
        500,
        'failed to create record',
      );
    }
  }

  async getAllRecords(professionalId: string): Promise<AllProfessionalRecords> {
    try {
      const records = await this.prisma.appointmentRecord.findMany({
        where: {
          professional_id: professionalId,
        },
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          appointment: {
            select: {
              client_name: true,
              appointment_date: true,
              appointment_time: true,
            },
          },
        },
      });

      const formatedRecords = records.map((record) => {
        return {
          recordId: record.id,
          clientName: record.appointment.client_name,
          scheduledDate: record.appointment.appointment_date,
          appointmentTime: record.appointment.appointment_time,
          createdAt: record.created_at,
          updatedAt: record.updated_at,
        };
      });

      return { records: formatedRecords };
    } catch (error) {
      throw new AppError(
        'record-repository.getAllRecords',
        500,
        'failed to get records',
      );
    }
  }

  async getOneRecord(recordId: string) {
    try {
      const recordData = await this.prisma.appointmentRecord.findFirst({
        where: {
          id: recordId,
        },
        select: {
          id: true,
          professional_id: true,
          record: true,
          created_at: true,
          updated_at: true,
          appointment: {
            select: {
              client_name: true,
              appointment_date: true,
              appointment_time: true,
            },
          },
        },
      });

      const formatedRecord = {
        recordId: recordData.id,
        professionalId: recordData.professional_id,
        clientName: recordData.appointment.client_name,
        scheduledDate: recordData.appointment.appointment_date,
        appointmentTime: recordData.appointment.appointment_time,
        record: recordData.record,
        createdAt: recordData.created_at,
        updatedAt: recordData.updated_at,
      };

      return formatedRecord;
    } catch (error) {
      throw new AppError(
        'record-repository.getOneRecord',
        500,
        'failed to get record',
      );
    }
  }
}

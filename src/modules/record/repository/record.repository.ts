import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import {
  IRecordRepository,
  Record,
  UpdatedRecordResponse,
} from '../interfaces/repository.interface';
import { CreateRecordDto } from '../dto/create-record.dto';
import { AppError } from '../../../common/errors/Error';
import { Prisma } from '@prisma/client';
import {
  AllProfessionalRecords,
  ProfessionalRecord,
  RecordFilters,
  RecordToReencrypt,
} from '../interfaces/record.interface';
import { UpdateRecordDto } from '../dto/update-record.dto';

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

  async getOneRecord(recordId: string): Promise<ProfessionalRecord> {
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

  async getRecordByFilter(filter: RecordFilters): Promise<ProfessionalRecord> {
    const { appointmentId } = filter;

    try {
      const recordQuery: Prisma.AppointmentRecordWhereInput = {};

      appointmentId ? (recordQuery.schedule_id = appointmentId) : recordQuery;

      const recordData = await this.prisma.appointmentRecord.findFirst({
        where: recordQuery,
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
        'record-repository.getRecordByFilter',
        500,
        'failed to get record',
      );
    }
  }

  async updateRecord(
    recordId: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<UpdatedRecordResponse> {
    try {
      const updatedRecord = await this.prisma.appointmentRecord.update({
        where: { id: recordId },
        data: {
          record: updateRecordDto.record,
        },
      });

      const { id, professional_id, schedule_id, created_at, updated_at } =
        updatedRecord;

      const recordResponse = {
        id,
        professionalId: professional_id,
        appointmentId: schedule_id,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return recordResponse;
    } catch (error) {
      throw new AppError(
        'record-repository.updateRecord',
        500,
        'failed to update record',
      );
    }
  }

  async allRecords(): Promise<RecordToReencrypt[]> {
    try {
      const records = await this.prisma.appointmentRecord.findMany({
        select: {
          id: true,
          record: true,
        },
      });

      return records;
    } catch (error) {
      throw new AppError(
        'record-repository.allRecords',
        500,
        'failed to get records',
      );
    }
  }

  async updateAllRecords(records: RecordToReencrypt[]): Promise<void> {
    try {
      await Promise.all(
        records.map(async (record) => {
          await this.prisma.appointmentRecord.update({
            where: { id: record.id },
            data: { record: record.record },
          });
        }),
      );
    } catch (error) {
      throw new AppError(
        'record-repository.updateAllRecords',
        500,
        'failed to update records',
      );
    }
  }
}

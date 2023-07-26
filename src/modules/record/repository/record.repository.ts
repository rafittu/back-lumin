import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IRecordRepository, Record } from '../interfaces/repository.interface';
import { CreateRecordDto } from '../dto/create-record.dto';
import { AppError } from '../../../common/errors/Error';
import { Prisma } from '@prisma/client';

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
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { IRecordRepository } from '../interfaces/repository.interface';
import { CreateRecordDto } from '../dto/create-record.dto';
import { AppError } from 'src/common/errors/Error';

@Injectable()
export class RecordRepository implements IRecordRepository {
  constructor(private prisma: PrismaService) {}

  async createRecord(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  ) {
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
      throw new AppError(
        'record-repository.createRecord',
        500,
        'failed to create record',
      );
    }
  }
}

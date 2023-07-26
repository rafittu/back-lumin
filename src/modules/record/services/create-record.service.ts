import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { CreateRecordDto } from '../dto/create-record.dto';

@Injectable()
export class CreateRecordService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(
    professionalId: string,
    scheduleId: string,
    record: CreateRecordDto,
  ) {
    if (!professionalId || !scheduleId) {
      throw new AppError(
        'record-module.createRecordService',
        400,
        'missing query parameter [professionalId, scheduleId]',
      );
    }

    console.log(record);
  }
}

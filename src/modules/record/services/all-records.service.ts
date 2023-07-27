import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { NewRecord } from '../interfaces/record.interface';

@Injectable()
export class GetAllRecordsService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(professionalId: string): Promise<NewRecord[]> {
    if (!professionalId) {
      throw new AppError(
        'record-module.createRecordService',
        400,
        'missing query parameter [professionalId]',
      );
    }

    return await this.recordRepository.getAllRecords(professionalId);
  }
}

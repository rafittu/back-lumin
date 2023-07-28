import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { AllProfessionalRecords } from '../interfaces/record.interface';

@Injectable()
export class GetOneRecordService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(recordId: string, professionalId: string) {
    if (!professionalId) {
      throw new AppError(
        'record-module.getRecordService',
        400,
        'missing query parameter [professionalId]',
      );
    }

    const record = await this.recordRepository.getOneRecord(recordId);

    console.log(record);
  }
}

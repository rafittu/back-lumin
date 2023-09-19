import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';
import {
  ProfessionalRecord,
  RecordFilters,
} from '../interfaces/record.interface';

@Injectable()
export class GetRecordByFilterService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(
    professionalId: string,
    filter: RecordFilters,
  ): Promise<ProfessionalRecord> {
    if (!professionalId) {
      throw new AppError(
        'record-module.getRecordByFilterService',
        400,
        'missing parameter [professionalId]',
      );
    }

    const recordData = await this.recordRepository.getRecordByFilter(filter);

    return recordData;
  }
}

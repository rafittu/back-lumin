import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';

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

    const recordData = await this.recordRepository.getOneRecord(recordId);

    if (professionalId != recordData.professionalId) {
      throw new AppError(
        'record-module.getRecordService',
        403,
        `record does not belong to the specified 'professionalId'`,
      );
    }
    delete recordData.professionalId;

    try {
      const cipherKey = Buffer.from(process.env.RECORD_CIPHER_KEY, 'hex');
      const cipherIv = Buffer.from(process.env.RECORD_CIPHER_IV, 'hex');

      const decipher = crypto.createDecipheriv(
        process.env.RECORD_CIPHER_ALGORITHM,
        cipherKey,
        cipherIv,
      );

      let decryptedRecord = decipher.update(recordData.record, 'hex', 'utf8');
      decryptedRecord += decipher.final('utf8');

      recordData.record = decryptedRecord;
    } catch (error) {
      throw new AppError('record-module.createRecordService', 500, error.code);
    }

    return recordData;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';

@Injectable()
export class ReencryptRecordsService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(): Promise<string> {
    try {
      const records = await this.recordRepository.allRecords();

      const updatedRecords = records.map((record) => {
        const currentCipherKey = Buffer.from(
          process.env.RECORD_CIPHER_KEY,
          'hex',
        );
        const currentCipherIv = Buffer.from(
          process.env.RECORD_CIPHER_IV,
          'hex',
        );

        const decipher = crypto.createDecipheriv(
          process.env.RECORD_CIPHER_ALGORITHM,
          currentCipherKey,
          currentCipherIv,
        );

        let decryptedRecord = decipher.update(record.record, 'hex', 'utf8');
        decryptedRecord += decipher.final('utf8');

        const newCipherKey = Buffer.from(process.env.NEW_CIPHER_KEY, 'hex');
        const newCipherIv = Buffer.from(process.env.NEW_CIPHER_IV, 'hex');

        const cipher = crypto.createCipheriv(
          process.env.RECORD_CIPHER_ALGORITHM,
          newCipherKey,
          newCipherIv,
        );

        let encryptedRecord = cipher.update(decryptedRecord, 'utf8', 'hex');
        encryptedRecord += cipher.final('hex');

        return {
          ...record,
          record: encryptedRecord,
        };
      });

      await this.recordRepository.updateAllRecords(updatedRecords);

      return 'Records reencrypted successfully';
    } catch (error) {
      throw new AppError(
        'record-module.reencryptRecordsService',
        500,
        error.code,
      );
    }
  }
}

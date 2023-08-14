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

  async decryptRecord(encryptedData: string): Promise<string> {
    const cipherKey = Buffer.from(process.env.RECORD_CIPHER_KEY, 'hex');
    const cipherIv = Buffer.from(process.env.RECORD_CIPHER_IV, 'hex');

    const decipher = crypto.createDecipheriv(
      process.env.RECORD_CIPHER_KEY,
      cipherKey,
      cipherIv,
    );

    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');

    return decryptedData;
  }

  async encryptRecord(data: string): Promise<string> {
    const cipherKey = Buffer.from(
      process.env.NEW_CIPHER_KEY || process.env.RECORD_CIPHER_KEY,
      'hex',
    );
    const cipherIv = Buffer.from(
      process.env.NEW_CIPHER_IV || process.env.RECORD_CIPHER_IV,
      'hex',
    );

    const cipher = crypto.createCipheriv(
      process.env.RECORD_CIPHER_KEY,
      cipherKey,
      cipherIv,
    );

    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
  }

  async execute(): Promise<string> {
    try {
      const records = await this.recordRepository.allRecords();

      const updatedRecords = await Promise.all(
        records.map(async (record) => {
          const decryptedRecord = await this.decryptRecord(record.record);
          const encryptedRecord = await this.encryptRecord(decryptedRecord);

          return {
            ...record,
            record: encryptedRecord,
          };
        }),
      );

      await this.recordRepository.updateAllRecords(updatedRecords);

      return 'Records reencrypted successfully';
    } catch (error) {
      throw new AppError(
        'record-module.reencryptRecordsService',
        500,
        error.message,
      );
    }
  }
}

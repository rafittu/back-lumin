import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';
import { UpdateRecordDto } from '../dto/update-record.dto';
import { UpdatedRecord } from '../interfaces/record.interface';

@Injectable()
export class UpdateRecordService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(
    recordId: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<UpdatedRecord> {
    const { record } = updateRecordDto;
    let encryptedRecord: string;

    try {
      const cipherKey = Buffer.from(process.env.RECORD_CIPHER_KEY, 'hex');
      const cipherIv = Buffer.from(process.env.RECORD_CIPHER_IV, 'hex');

      const cipher = crypto.createCipheriv(
        process.env.RECORD_CIPHER_ALGORITHM,
        cipherKey,
        cipherIv,
      );

      encryptedRecord = cipher.update(record, 'utf8', 'hex');
      encryptedRecord += cipher.final('hex');
    } catch (error) {
      throw new AppError('record-module.updateRecordService', 500, error.code);
    }

    const { createdAt, updatedAt } = await this.recordRepository.updateRecord(
      recordId,
      {
        record: encryptedRecord,
      },
    );

    const updatedRecord = {
      id: recordId,
      record: updateRecordDto.record,
      createdAt,
      updatedAt,
    };

    return updatedRecord;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import { UpdateRecordDto } from '../dto/update-record.dto';

@Injectable()
export class UpdateRecordService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
    private schedulerRepository: SchedulerRepository,
  ) {}

  async execute(
    recordId: string,
    professionalId: string,
    updateRecordDto: UpdateRecordDto,
  ) {
    const { record } = updateRecordDto;
    let encryptedRecord: string;

    if (!professionalId) {
      throw new AppError(
        'record-module.updateRecordService',
        400,
        'missing query parameter [professionalId]',
      );
    }

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

    const { created_at, updated_at } = await this.recordRepository.updateRecord(
      recordId,
      {
        record: encryptedRecord,
      },
    );

    const updatedRecord = {
      id: recordId,
      record: updateRecordDto.record,
      createdAt: created_at,
      updatedAt: updated_at,
    };

    return updatedRecord;
  }
}

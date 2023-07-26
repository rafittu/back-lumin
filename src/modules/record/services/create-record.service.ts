import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { CreateRecordDto } from '../dto/create-record.dto';
import * as crypto from 'crypto';

@Injectable()
export class CreateRecordService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
  ) {}

  async execute(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  ) {
    const { record } = createRecordDto;

    if (!professionalId || !appointmentId) {
      throw new AppError(
        'record-module.createRecordService',
        400,
        'missing query parameter [professionalId, appointmentId]',
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

      let encryptedRecord = cipher.update(record, 'utf8', 'hex');
      encryptedRecord += cipher.final('hex');

      createRecordDto.record = encryptedRecord;
    } catch (error) {
      throw new AppError('record-module.createRecordService', 500, error.code);
    }

    return await this.recordRepository.createRecord(
      professionalId,
      appointmentId,
      createRecordDto,
    );
  }
}

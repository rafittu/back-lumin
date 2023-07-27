import { Inject, Injectable } from '@nestjs/common';
import { RecordRepository } from '../repository/record.repository';
import { IRecordRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { CreateRecordDto } from '../dto/create-record.dto';
import * as crypto from 'crypto';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import { NewRecord } from '../interfaces/record.interface';

@Injectable()
export class CreateRecordService {
  constructor(
    @Inject(RecordRepository)
    private recordRepository: IRecordRepository,
    private schedulerRepository: SchedulerRepository,
  ) {}

  async execute(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  ): Promise<NewRecord> {
    const { record } = createRecordDto;

    if (!professionalId || !appointmentId) {
      throw new AppError(
        'record-module.createRecordService',
        400,
        'missing query parameter [professionalId, appointmentId]',
      );
    }

    const appointmentResponse = await this.schedulerRepository.getApptByFilter(
      professionalId,
      { appointmentId },
    );

    const { clientName, appointmentDate, appointmentTime } =
      appointmentResponse.appointments[0];

    const currentDate = new Date();
    const apptDate = new Date(appointmentDate);

    if (apptDate > currentDate) {
      throw new AppError(
        'record-module.createRecordService',
        422,
        'cannot create a record before the appointment date',
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

    const { id, createdAt } = await this.recordRepository.createRecord(
      professionalId,
      appointmentId,
      createRecordDto,
    );

    const newRecord = {
      recordId: id,
      clientName,
      scheduledDate: appointmentDate,
      appointmentTime,
      createdAt,
    };

    return newRecord;
  }
}

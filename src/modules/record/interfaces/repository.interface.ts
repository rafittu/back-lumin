import { CreateRecordDto } from '../dto/create-record.dto';
import { NewRecord } from './record.interface';

export interface Record {
  id: string;
  professionalId: string;
  createdAt: Date;
}

export interface IRecordRepository {
  createRecord(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  ): Promise<Record>;
  getAllRecords(professionalId: string);
}

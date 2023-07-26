import { CreateRecordDto } from '../dto/create-record.dto';

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
}

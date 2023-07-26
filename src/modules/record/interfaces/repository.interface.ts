import { CreateRecordDto } from '../dto/create-record.dto';

export interface IRecordRepository {
  createRecord(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  );
}

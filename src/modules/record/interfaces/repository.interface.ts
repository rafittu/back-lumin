import { CreateRecordDto } from '../dto/create-record.dto';
import { AllProfessionalRecords, ProfessionalRecord } from './record.interface';

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
  getAllRecords(professionalId: string): Promise<AllProfessionalRecords>;
  getOneRecord(recordId: string): Promise<ProfessionalRecord>;
}

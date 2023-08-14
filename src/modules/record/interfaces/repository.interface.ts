import { CreateRecordDto } from '../dto/create-record.dto';
import { UpdateRecordDto } from '../dto/update-record.dto';
import {
  AllProfessionalRecords,
  ProfessionalRecord,
  RecordToReencrypt,
} from './record.interface';

export interface Record {
  id: string;
  professionalId: string;
  createdAt: Date;
}

export interface UpdatedRecordResponse {
  id: string;
  professionalId: string;
  appointmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecordRepository {
  createRecord(
    professionalId: string,
    appointmentId: string,
    createRecordDto: CreateRecordDto,
  ): Promise<Record>;
  getAllRecords(professionalId: string): Promise<AllProfessionalRecords>;
  getOneRecord(recordId: string): Promise<ProfessionalRecord>;
  updateRecord(
    recordId: string,
    updateRecordDto: UpdateRecordDto,
  ): Promise<UpdatedRecordResponse>;
  allRecords(): Promise<RecordToReencrypt[]>;
  updateAllRecords(records: RecordToReencrypt[]): Promise<void>;
}

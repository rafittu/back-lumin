export interface NewRecord {
  recordId: string;
  clientName: string;
  scheduledDate: string;
  appointmentTime: string;
  createdAt: Date;
}

export interface ProfessionalRecord {
  recordId: string;
  professionalId?: string;
  clientName: string;
  scheduledDate: string;
  appointmentTime: string;
  record?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AllProfessionalRecords {
  records: ProfessionalRecord[];
}

export interface UpdatedRecord {
  id: string;
  record: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecordToReencrypt {
  id: string;
  record: string;
}

export interface RecordFilters {
  appointmentId: string;
}

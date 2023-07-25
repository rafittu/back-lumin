export interface NewAppointment {
  id: string;
  professionalId: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  professionalId: string;
  clientName: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalAppointments {
  appointments: Appointment[];
}

export interface AppointmentFilters {
  appointmentId?: string;
  clientName?: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export interface DeletedAppointment {
  'Appointment deleted': Appointment;
}

export interface PaymentResponse {
  id: string;
  totalPaid?: string;
  paymentDate?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ManyPaymentsResponse {
  payments: PaymentResponse[];
}

export interface PaymentFilter {
  appointmentId?: string;
  clientName?: string;
  appointmentDateFrom?: string;
  appointmentDateUntil?: string;
  status?: string;
}

export interface PaymentByFilter {
  id: string;
  appointmentId: string;
  appointmentDate: string;
  paymentDate?: string;
  paymentMethod: string;
  totalPaid?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentsByFilterResponse {
  payments: PaymentByFilter[];
}

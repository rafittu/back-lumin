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
  clientName: string;
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

export interface GetPaymentResponse {
  id: string;
  appointmentId: string;
  professionalId: string;
  totalPaid?: string;
  paymentMethod?: string;
  paymentDate?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

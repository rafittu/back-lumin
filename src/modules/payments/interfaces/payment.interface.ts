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

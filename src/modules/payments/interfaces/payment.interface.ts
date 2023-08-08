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

export interface DateFilter {
  from?: string;
  until?: string;
}

export interface PaymentFilter {
  appointmentId?: string;
  clientName?: string;
  appointmentDate?: DateFilter;
  status?: string;
}

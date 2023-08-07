export interface PaymentResponse {
  id: string;
  totalPaid?: string;
  paymentDate?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

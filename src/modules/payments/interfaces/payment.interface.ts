import { Decimal } from '@prisma/client/runtime';

export interface PaymentResponse {
  id: string;
  totalPaid: Decimal;
  paymentDate: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

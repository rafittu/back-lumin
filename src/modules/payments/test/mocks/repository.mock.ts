import { faker } from '@faker-js/faker';
import { PaymentResponse } from '../../interfaces/payment.interface';
import { CreatePaymentDto } from '../../dto/create-payment.dto';
import { PaymentMethod } from '../../enum/payment-method.enum';
import { PaymentStatus } from '../../enum/payment-status.enum';
import { Payment } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockCreatePayment: CreatePaymentDto = {
  paymentDate: faker.date.recent().toISOString().slice(0, 10),
  paymentMethod: PaymentMethod.PIX,
  status: PaymentStatus.PAID,
  totalPaid: faker.commerce.price(),
};

export const mockCreatePaymentPrismaResponse: Payment = {
  id: faker.string.uuid(),
  professional_id: mockProfessionalId,
  appointment_id: mockAppointmentId,
  payment_date: mockCreatePayment.paymentDate,
  payment_method: mockCreatePayment.paymentMethod,
  total_paid: mockCreatePayment.totalPaid,
  status: mockCreatePayment.status,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockPaymentResponse: PaymentResponse = {
  id: mockCreatePaymentPrismaResponse.id,
  paymentDate: mockCreatePaymentPrismaResponse.payment_date,
  status: mockCreatePaymentPrismaResponse.status,
  totalPaid: mockCreatePaymentPrismaResponse.total_paid,
  createdAt: mockCreatePaymentPrismaResponse.created_at,
  updatedAt: mockCreatePaymentPrismaResponse.updated_at,
};

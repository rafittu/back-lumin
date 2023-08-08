import { faker } from '@faker-js/faker';
import {
  ManyPaymentsResponse,
  PaymentResponse,
} from '../../interfaces/payment.interface';
import { CreatePaymentDto } from '../../dto/create-payment.dto';
import { PaymentMethod } from '../../enum/payment-method.enum';
import { PaymentStatus } from '../../enum/payment-status.enum';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockAppointmentsIds = [faker.string.uuid(), faker.string.uuid()];

export const mockCreatePayment: CreatePaymentDto = {
  paymentDate: faker.date.recent().toISOString().slice(0, 10),
  paymentMethod: PaymentMethod.PIX,
  status: PaymentStatus.PAID,
  totalPaid: faker.commerce.price(),
};

export const mockPaymentResponse: PaymentResponse = {
  id: faker.string.uuid(),
  paymentDate: mockCreatePayment.paymentDate,
  status: mockCreatePayment.status,
  totalPaid: mockCreatePayment.totalPaid,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const mockManyPaymentsResponse: ManyPaymentsResponse = {
  payments: [mockPaymentResponse],
};

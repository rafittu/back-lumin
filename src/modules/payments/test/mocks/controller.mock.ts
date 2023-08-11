import { faker } from '@faker-js/faker';
import {
  GetPaymentResponse,
  ManyPaymentsResponse,
  PaymentByFilter,
  PaymentFilter,
  PaymentResponse,
  PaymentsByFilterResponse,
} from '../../interfaces/payment.interface';
import { CreatePaymentDto } from '../../dto/create-payment.dto';
import { PaymentMethod } from '../../enum/payment-method.enum';
import { PaymentStatus } from '../../enum/payment-status.enum';
import { UpdatePaymentDto } from '../../dto/update-payment.dto';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockAppointmentsIds = [faker.string.uuid(), faker.string.uuid()];

export const mockCreatePayment: CreatePaymentDto = {
  paymentDate: faker.date.recent().toISOString().slice(0, 10),
  paymentMethod: PaymentMethod.PIX,
  status: PaymentStatus.PAID,
  totalPaid: faker.commerce.price(),
};

export const mockPaymentId = faker.string.uuid();

export const mockPaymentResponse: PaymentResponse = {
  id: mockPaymentId,
  paymentDate: mockCreatePayment.paymentDate,
  status: mockCreatePayment.status,
  totalPaid: mockCreatePayment.totalPaid,
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
};

export const mockManyPaymentsResponse: ManyPaymentsResponse = {
  payments: [mockPaymentResponse],
};

export const mockPaymentByFilter: PaymentByFilter = {
  id: mockPaymentResponse.id,
  appointmentId: mockAppointmentId,
  appointmentDate: faker.date.recent().toISOString().slice(0, 10),
  clientName: faker.person.fullName(),
  paymentDate: mockPaymentResponse.paymentDate,
  paymentMethod: mockCreatePayment.paymentMethod,
  totalPaid: mockPaymentResponse.totalPaid,
  status: mockPaymentResponse.status,
  createdAt: mockPaymentResponse.createdAt,
  updatedAt: mockPaymentResponse.updatedAt,
};

export const mockPaymentsByFilter: PaymentsByFilterResponse = {
  payments: [mockPaymentByFilter],
};

export const mockGetPaymentFilter: PaymentFilter = {
  appointmentId: mockPaymentByFilter.appointmentId,
  clientName: mockPaymentByFilter.clientName,
  status: mockPaymentByFilter.status,
};

export const mockGetPaymentResponse: GetPaymentResponse = {
  id: mockPaymentResponse.id,
  professionalId: mockProfessionalId,
  appointmentId: mockAppointmentId,
  paymentDate: mockPaymentResponse.paymentDate,
  paymentMethod: mockCreatePayment.paymentMethod,
  totalPaid: mockPaymentResponse.totalPaid,
  status: mockPaymentResponse.status,
  createdAt: mockPaymentResponse.createdAt,
  updatedAt: mockPaymentResponse.updatedAt,
};

export const mockUpdatePayment: UpdatePaymentDto = {
  totalPaid: faker.commerce.price(),
};

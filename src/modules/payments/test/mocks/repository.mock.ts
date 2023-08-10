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
import { Payment, Scheduler } from '@prisma/client';

export const mockProfessionalId = faker.string.uuid();

export const mockAppointmentId = faker.string.uuid();

export const mockAppointmentsIds = [faker.string.uuid(), faker.string.uuid()];

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

export const mockManyPaymentsResponse: ManyPaymentsResponse = {
  payments: [mockPaymentResponse],
};

export const mockGetPaymentFilter: PaymentFilter = {
  appointmentId: mockAppointmentId,
  clientName: faker.person.fullName(),
  status: PaymentStatus.PAID,
  appointmentDateFrom: faker.date.recent().toISOString().slice(0, 10),
  appointmentDateUntil: faker.date.recent().toISOString().slice(0, 10),
};

interface PrismaPaymentsData extends Payment {
  appointment: { appointment: Scheduler };
}

export const mockPrismaPaymentByFilterResponse: PrismaPaymentsData[] = [
  {
    id: faker.string.uuid(),
    professional_id: mockGetPaymentFilter.appointmentId,
    appointment_id: mockGetPaymentFilter.appointmentId,
    payment_date: mockCreatePayment.paymentDate,
    payment_method: mockCreatePayment.paymentMethod,
    total_paid: mockCreatePayment.totalPaid,
    status: mockGetPaymentFilter.status as PaymentStatus.PAID,
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    appointment: {
      appointment: {
        id: faker.string.uuid(),
        professional_id: mockProfessionalId,
        appointment_date: faker.date.recent().toISOString().slice(0, 10),
        client_name: mockGetPaymentFilter.clientName,
        client_phone: faker.phone.number(),
        appointment_time: faker.date.recent().toISOString().slice(11, 16),
        created_at: faker.date.recent(),
        updated_at: faker.date.recent(),
      },
    },
  },
];

export const mockPaymentByFilter: PaymentByFilter = {
  id: mockPrismaPaymentByFilterResponse[0].id,
  appointmentId: mockPrismaPaymentByFilterResponse[0].appointment_id,
  appointmentDate:
    mockPrismaPaymentByFilterResponse[0].appointment.appointment
      .appointment_date,
  clientName:
    mockPrismaPaymentByFilterResponse[0].appointment.appointment.client_name,
  paymentDate: mockPrismaPaymentByFilterResponse[0].payment_date,
  paymentMethod: mockPrismaPaymentByFilterResponse[0].payment_method,
  totalPaid: mockPrismaPaymentByFilterResponse[0].total_paid,
  status: mockPrismaPaymentByFilterResponse[0].status,
  createdAt: mockPrismaPaymentByFilterResponse[0].created_at,
  updatedAt: mockPrismaPaymentByFilterResponse[0].updated_at,
};

export const mockPaymentsByFilter: PaymentsByFilterResponse = {
  payments: [mockPaymentByFilter],
};

export const mockPrismaGetPaymentResponse: Payment = {
  id: faker.string.uuid(),
  professional_id: mockGetPaymentFilter.appointmentId,
  appointment_id: mockGetPaymentFilter.appointmentId,
  payment_date: mockCreatePayment.paymentDate,
  payment_method: mockCreatePayment.paymentMethod,
  total_paid: mockCreatePayment.totalPaid,
  status: mockGetPaymentFilter.status as PaymentStatus.PAID,
  created_at: faker.date.recent(),
  updated_at: faker.date.recent(),
};

export const mockGetPaymentResponse: GetPaymentResponse = {
  id: mockPrismaGetPaymentResponse.id,
  professionalId: mockPrismaGetPaymentResponse.professional_id,
  appointmentId: mockPrismaGetPaymentResponse.appointment_id,
  paymentDate: mockPrismaGetPaymentResponse.payment_date,
  paymentMethod: mockPrismaGetPaymentResponse.payment_method,
  totalPaid: mockPrismaGetPaymentResponse.total_paid,
  status: mockPrismaGetPaymentResponse.status,
  createdAt: mockPrismaGetPaymentResponse.created_at,
  updatedAt: mockPrismaGetPaymentResponse.updated_at,
};

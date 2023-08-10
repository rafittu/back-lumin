import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import {
  GetPaymentResponse,
  ManyPaymentsResponse,
  PaymentFilter,
  PaymentResponse,
  PaymentsByFilterResponse,
} from './payment.interface';

export interface IPaymentRepository {
  createPayment(
    professionalId: string,
    appointmentId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse>;
  createManyPayments(
    professionalId: string,
    appointmentsIds: string[],
    createPaymentDto: CreatePaymentDto,
  ): Promise<ManyPaymentsResponse>;
  findPaymentByFilter(
    professionalId: string,
    filter: PaymentFilter,
  ): Promise<PaymentsByFilterResponse>;
  getPaymentById(id: string): Promise<GetPaymentResponse>;
  updatePayment(paymentId: string, updatePaymentDto: UpdatePaymentDto);
}

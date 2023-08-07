import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { ManyPaymentsResponse, PaymentResponse } from './payment.interface';

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
  findPaymentByFilter(filter);
  getOnePayment(id);
  updatePayment(paymentId: string, updatePaymentDto: UpdatePaymentDto);
}

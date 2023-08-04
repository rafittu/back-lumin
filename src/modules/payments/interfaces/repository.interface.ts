import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

export interface IPaymentRepository {
  createPayment(
    professionalId: string,
    appointmentId: string,
    createPaymentDto: CreatePaymentDto,
  );
  findPaymentByFilter(filter);
  getOnePayment(id);
  updatePayment(paymentId: string, updatePaymentDto: UpdatePaymentDto);
}

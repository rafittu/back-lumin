import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class UpdatePaymentService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  execute(paymentId: string, updatePaymentDto: UpdatePaymentDto) {
    return this.paymentRepository.updatePayment(paymentId, updatePaymentDto);
  }
}

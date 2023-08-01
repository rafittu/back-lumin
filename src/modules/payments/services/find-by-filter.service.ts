import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';

@Injectable()
export class FindPaymentByFilterService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  execute(filter) {
    return this.paymentRepository.findPaymentByFilter(filter);
  }
}

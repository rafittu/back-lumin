import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { GetPaymentResponse } from '../interfaces/payment.interface';

@Injectable()
export class GetOnePaymentService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  execute(id: string): Promise<GetPaymentResponse> {
    return this.paymentRepository.getPaymentById(id);
  }
}

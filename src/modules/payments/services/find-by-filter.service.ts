import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import {
  PaymentFilter,
  PaymentsByFilterResponse,
} from '../interfaces/payment.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class FindPaymentByFilterService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  execute(
    professionalId: string,
    filter: PaymentFilter,
  ): Promise<PaymentsByFilterResponse> {
    if (
      !professionalId ||
      typeof professionalId !== 'string' ||
      professionalId.trim() === ''
    ) {
      throw new AppError(
        'payment-service.findByFilter',
        400,
        'Missing or invalid query parameter: professionalId',
      );
    }

    return this.paymentRepository.findPaymentByFilter(professionalId, filter);
  }
}

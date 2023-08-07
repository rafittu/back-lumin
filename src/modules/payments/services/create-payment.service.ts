import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { AppError } from '../../../common/errors/Error';
import { PaymentResponse } from '../interfaces/payment.interface';

@Injectable()
export class CreatePaymentService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  execute(
    professionalId: string,
    appointmentId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    if (!professionalId || !appointmentId) {
      throw new AppError(
        'payment-service.createPayment',
        400,
        'missing query parameter [professionalId, appointmentId]',
      );
    }

    return this.paymentRepository.createPayment(
      professionalId,
      appointmentId,
      createPaymentDto,
    );
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { AppError } from '../../../common/errors/Error';
import { PaymentResponse } from '../interfaces/payment.interface';
import { PaymentStatus } from '../enum/payment-status.enum';

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

    if (createPaymentDto.status === PaymentStatus.PAID) {
      const requiredFields = ['totalPaid', 'paymentDate', 'paymentMethod'];
      const missingFields = requiredFields.filter(
        (field) => !createPaymentDto[field],
      );

      if (missingFields.length > 0) {
        throw new AppError(
          'payment-service.createPayment',
          400,
          `missing values for fields: ${missingFields.join(', ')}`,
        );
      }
    }

    return this.paymentRepository.createPayment(
      professionalId,
      appointmentId,
      createPaymentDto,
    );
  }
}

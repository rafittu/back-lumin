import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentStatus } from '../enum/payment-status.enum';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class UpdatePaymentService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  async execute(paymentId: string, updatePaymentDto: UpdatePaymentDto) {
    const paymentToUpdate = await this.paymentRepository.getPaymentById(
      paymentId,
    );

    if (
      paymentToUpdate.status === PaymentStatus.OPEN &&
      (!updatePaymentDto.status ||
        updatePaymentDto.status !== PaymentStatus.PAID)
    ) {
      const { totalPaid, paymentDate, paymentMethod } = updatePaymentDto;

      if (totalPaid || paymentDate || paymentMethod) {
        throw new AppError(
          'payment-service.updatePayment',
          400,
          'The properties totalPaid, paymentDate, and paymentMethod are not allowed when the payment status is OPEN',
        );
      }
    }

    if (updatePaymentDto.status === PaymentStatus.PAID) {
      const requiredFields = ['totalPaid', 'paymentDate', 'paymentMethod'];
      const missingFields = requiredFields.filter(
        (field) => !updatePaymentDto[field],
      );

      if (missingFields.length > 0) {
        throw new AppError(
          'payment-service.updatePayment',
          400,
          `missing values for fields: ${missingFields.join(', ')}`,
        );
      }
    }

    return this.paymentRepository.updatePayment(paymentId, updatePaymentDto);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { AppError } from '../../../common/errors/Error';
import { PaymentStatus } from '../enum/payment-status.enum';
import { ManyPaymentsResponse } from '../interfaces/payment.interface';

@Injectable()
export class CreateManyPaymentsService {
  constructor(
    @Inject(PaymentRepository)
    private paymentRepository: IPaymentRepository,
  ) {}

  execute(
    professionalId: string,
    appointmentsIds: string[],
    createPaymentDto: CreatePaymentDto,
  ): Promise<ManyPaymentsResponse> {
    if (
      !professionalId ||
      typeof professionalId !== 'string' ||
      professionalId.trim() === ''
    ) {
      throw new AppError(
        'payment-service.createManyPayments',
        400,
        'Missing or invalid query parameter: professionalId',
      );
    }

    if (
      !appointmentsIds ||
      !Array.isArray(appointmentsIds) ||
      appointmentsIds.length === 0
    ) {
      throw new AppError(
        'payment-service.createManyPayments',
        400,
        'Missing or invalid query parameter: appointmentsIds',
      );
    }

    if (createPaymentDto.status === PaymentStatus.OPEN) {
      if (
        'totalPaid' in createPaymentDto ||
        'paymentDate' in createPaymentDto ||
        'paymentMethod' in createPaymentDto
      ) {
        throw new AppError(
          'payment-service.createManyPayments',
          400,
          'The properties totalPaid, paymentDate, and paymentMethod are not allowed when the status is OPEN',
        );
      }
    }

    if (createPaymentDto.status === PaymentStatus.PAID) {
      const requiredFields = ['totalPaid', 'paymentDate', 'paymentMethod'];
      const missingFields = requiredFields.filter(
        (field) => !createPaymentDto[field],
      );

      if (missingFields.length > 0) {
        throw new AppError(
          'payment-service.createManyPayments',
          400,
          `missing values for fields: ${missingFields.join(', ')}`,
        );
      }
    }

    const priceForAppointment =
      Number(createPaymentDto.totalPaid) / appointmentsIds.length;

    createPaymentDto.totalPaid = priceForAppointment.toFixed(2);

    return this.paymentRepository.createManyPayments(
      professionalId,
      appointmentsIds,
      createPaymentDto,
    );
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { PaymentResponse } from '../interfaces/payment.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaService) {}

  async createPayment(
    professionalId: string,
    appointmentId: string,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    const { paymentDate, paymentMethod, status, totalPaid } = createPaymentDto;

    try {
      const payment = await this.prisma.payment.create({
        data: {
          professional_id: professionalId,
          appointment_id: appointmentId,
          payment_date: paymentDate,
          payment_method: paymentMethod,
          status,
          total_paid: totalPaid,
        },
      });

      const paymentResponse = {
        id: payment.id,
        totalPaid,
        paymentDate,
        status,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
      };

      return paymentResponse;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError(
          `payment-repository.createPayment'`,
          409,
          'a payment for this appointment already exists',
        );
      }

      throw new AppError(
        'payment-repository.createPayment',
        500,
        'payment not created',
      );
    }
  }

  async findPaymentByFilter(filter) {
    try {
      return 'payment data';
    } catch (error) {
      throw new AppError('Not Implemented', 501, 'message');
    }
  }

  async getOnePayment(id) {
    try {
      return 'payment data';
    } catch (error) {
      throw new AppError('Not Implemented', 501, 'message');
    }
  }

  async updatePayment(paymentId: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      return 'payment data';
    } catch (error) {
      throw new AppError('Not Implemented', 501, 'message');
    }
  }
}
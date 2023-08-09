import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import {
  ManyPaymentsResponse,
  PaymentFilter,
  PaymentResponse,
  PaymentsByFilterResponse,
} from '../interfaces/payment.interface';
import { Prisma } from '@prisma/client';
import { PaymentStatus } from '../enum/payment-status.enum';

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

  async createManyPayments(
    professionalId: string,
    appointmentsIds: string[],
    createPaymentDto: CreatePaymentDto,
  ): Promise<ManyPaymentsResponse> {
    const { paymentDate, paymentMethod, status, totalPaid } = createPaymentDto;

    const paymentsData = appointmentsIds.map((appointmentId) => ({
      professional_id: professionalId,
      appointment_id: appointmentId,
      payment_date: paymentDate,
      payment_method: paymentMethod,
      status,
      total_paid: totalPaid,
    }));

    try {
      await this.prisma.$transaction(async (prisma) => {
        const existingPayments = await prisma.payment.findMany({
          where: {
            appointment_id: { in: appointmentsIds },
          },
        });

        if (existingPayments.length > 0) {
          throw new AppError(
            'payment-repository.createManyPayments',
            400,
            `payment already exists for appointmentId: ${existingPayments[0].appointment_id}`,
          );
        }

        await prisma.payment.createMany({
          data: paymentsData,
        });
      });

      const createdPayments = await this.prisma.payment.findMany({
        where: {
          appointment_id: { in: appointmentsIds },
        },
      });

      const paymentsResponse = createdPayments.map((payment) => {
        return {
          id: payment.id,
          totalPaid: payment.total_paid,
          paymentDate: payment.payment_date,
          status: payment.status,
          createdAt: payment.created_at,
          updatedAt: payment.updated_at,
        };
      });

      return { payments: paymentsResponse };
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(error.internalCode, error.code, error.message);
      }

      throw new AppError(
        'payment-repository.createManyPayments',
        500,
        'payments not created',
      );
    }
  }

  async findPaymentByFilter(
    professionalId: string,
    filter: PaymentFilter,
  ): Promise<PaymentsByFilterResponse> {
    const {
      appointmentId,
      clientName,
      appointmentDateFrom,
      appointmentDateUntil,
      status,
    } = filter;

    try {
      const paymentQuery: Prisma.PaymentWhereInput = {
        professional_id: professionalId,
      };

      appointmentId
        ? (paymentQuery.appointment_id = appointmentId)
        : paymentQuery;

      status ? (paymentQuery.status = status as PaymentStatus) : paymentQuery;

      if (clientName) {
        paymentQuery.appointment = {
          appointment: {
            client_name: clientName,
          },
        };
      }

      if (appointmentDateFrom || appointmentDateUntil) {
        paymentQuery.appointment = {
          appointment: {
            appointment_date: {
              gte: appointmentDateFrom,
              lte: appointmentDateUntil,
            },
          },
        };
      }

      const payments = await this.prisma.payment.findMany({
        where: paymentQuery,
        select: {
          id: true,
          appointment_id: true,
          payment_date: true,
          payment_method: true,
          total_paid: true,
          status: true,
          created_at: true,
          updated_at: true,
          appointment: {
            select: {
              appointment: {
                select: {
                  appointment_date: true,
                  client_name: true,
                },
              },
            },
          },
        },
      });

      const paymentsResponse = payments.map((payment) => ({
        id: payment.id,
        appointmentId: payment.appointment_id,
        appointmentDate: payment.appointment.appointment.appointment_date,
        clientName: payment.appointment.appointment.client_name,
        paymentDate: payment.payment_date,
        paymentMethod: payment.payment_method,
        totalPaid: payment.total_paid,
        status: payment.status,
        createdAt: payment.created_at,
        updatedAt: payment.updated_at,
      }));

      return {
        payments: paymentsResponse,
      };
    } catch (error) {
      throw new AppError(
        'payment-repository.getPaymentByFilter',
        500,
        'failed to get payment',
      );
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

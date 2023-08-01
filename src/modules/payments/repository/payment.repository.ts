import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import axios from 'axios';
import { AppError } from '../../../common/errors/Error';
import { IPaymentRepository } from '../interfaces/repository.interface';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaService) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      return 'payment data';
    } catch (error) {
      throw new AppError('Not Implemented', 501, 'message');
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

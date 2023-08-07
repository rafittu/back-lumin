import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PrismaService } from 'src/prisma.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { PaymentRepository } from './repository/payment.repository';
import { CreatePaymentService } from './services/create-payment.service';
import { GetOnePaymentService } from './services/get-one-payment.service';
import { FindPaymentByFilterService } from './services/find-by-filter.service';
import { UpdatePaymentService } from './services/update-payment.service';
import { CreateManyPaymentsService } from './services/create-many-pmts.service';

@Module({
  controllers: [PaymentsController],
  providers: [
    PrismaService,
    RedisCacheService,
    PaymentRepository,
    CreatePaymentService,
    CreateManyPaymentsService,
    GetOnePaymentService,
    FindPaymentByFilterService,
    UpdatePaymentService,
  ],
})
export class PaymentsModule {}

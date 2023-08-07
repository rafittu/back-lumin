import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { PaymentRepository } from '../repository/payment.repository';
import {
  mockAppointmentId,
  mockCreatePayment,
  mockCreatePaymentPrismaResponse,
  mockPaymentResponse,
  mockProfessionalId,
} from './mocks/repository.mock';
import { Prisma } from '@prisma/client';
import { AppError } from '../../../common/errors/Error';

describe('PaymentRepository', () => {
  let paymentRepository: PaymentRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentRepository, PrismaService],
    }).compile();

    paymentRepository = module.get<PaymentRepository>(PaymentRepository);

    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(paymentRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create payment', () => {
    it('should create a new payment successfully', async () => {
      jest
        .spyOn(prismaService.payment, 'create')
        .mockResolvedValueOnce(mockCreatePaymentPrismaResponse);

      const result = await paymentRepository.createPayment(
        mockProfessionalId,
        mockAppointmentId,
        mockCreatePayment,
      );

      expect(prismaService.payment.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentResponse);
    });

    it('should throw an AppError if a payment already exists for an appointment', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'error message',
        {
          code: 'error code',
          clientVersion: '',
        },
      );

      jest
        .spyOn(prismaService.payment, 'create')
        .mockRejectedValueOnce(prismaError);

      try {
        await paymentRepository.createPayment(
          mockProfessionalId,
          mockAppointmentId,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe(
          'a payment for this appointment already exists',
        );
      }
    });

    it('should throw an error if payment is not created', async () => {
      jest
        .spyOn(prismaService.payment, 'create')
        .mockRejectedValueOnce(new Error());

      try {
        await paymentRepository.createPayment(
          mockProfessionalId,
          mockAppointmentId,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('payment not created');
      }
    });
  });
});

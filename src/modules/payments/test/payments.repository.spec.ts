import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { PaymentRepository } from '../repository/payment.repository';
import {
  mockAppointmentId,
  mockAppointmentsIds,
  mockCreatePayment,
  mockCreatePaymentPrismaResponse,
  mockGetPaymentFilter,
  mockGetPaymentResponse,
  mockManyPaymentsResponse,
  mockPaymentResponse,
  mockPaymentsByFilter,
  mockPrismaGetPaymentResponse,
  mockPrismaPaymentByFilterResponse,
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

  describe('create many payments', () => {
    it('should create new payments successfully', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest.spyOn(prismaService.payment, 'findMany').mockResolvedValueOnce([]);

      jest
        .spyOn(prismaService.payment, 'createMany')
        .mockResolvedValueOnce({ count: 2 });

      jest
        .spyOn(prismaService.payment, 'findMany')
        .mockResolvedValueOnce([mockCreatePaymentPrismaResponse]);

      const result = await paymentRepository.createManyPayments(
        mockProfessionalId,
        mockAppointmentsIds,
        mockCreatePayment,
      );

      expect(prismaService.payment.createMany).toHaveBeenCalledTimes(1);
      expect(prismaService.payment.findMany).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockManyPaymentsResponse);
    });

    it('should thrown an AppError if a payment already exists for an appointment id', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest
        .spyOn(prismaService.payment, 'findMany')
        .mockResolvedValueOnce([mockCreatePaymentPrismaResponse]);

      try {
        await paymentRepository.createManyPayments(
          mockProfessionalId,
          mockAppointmentsIds,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `payment already exists for appointmentId: ${mockCreatePaymentPrismaResponse.appointment_id}`,
        );
      }
    });

    it('should thrown an AppError if payments not created', async () => {
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          await callback(prismaService);
        });

      jest.spyOn(prismaService.payment, 'findMany').mockResolvedValueOnce([]);

      jest
        .spyOn(prismaService.payment, 'createMany')
        .mockRejectedValueOnce(new Error());

      try {
        await paymentRepository.createManyPayments(
          mockProfessionalId,
          mockAppointmentsIds,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('payments not created');
      }
    });
  });

  describe('get payment by filter', () => {
    it('should get payment by appointmentId successfully', async () => {
      jest
        .spyOn(prismaService.payment, 'findMany')
        .mockResolvedValueOnce(mockPrismaPaymentByFilterResponse);

      const result = await paymentRepository.findPaymentByFilter(
        mockProfessionalId,
        { appointmentId: mockGetPaymentFilter.appointmentId },
      );

      expect(prismaService.payment.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentsByFilter);
    });

    it('should get payment by clientName successfully', async () => {
      jest
        .spyOn(prismaService.payment, 'findMany')
        .mockResolvedValueOnce(mockPrismaPaymentByFilterResponse);

      const result = await paymentRepository.findPaymentByFilter(
        mockProfessionalId,
        { clientName: mockGetPaymentFilter.clientName },
      );

      expect(prismaService.payment.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentsByFilter);
    });

    it('should get payment by appointmentDateFrom successfully', async () => {
      jest
        .spyOn(prismaService.payment, 'findMany')
        .mockResolvedValueOnce(mockPrismaPaymentByFilterResponse);

      const result = await paymentRepository.findPaymentByFilter(
        mockProfessionalId,
        { appointmentDateFrom: mockGetPaymentFilter.appointmentDateFrom },
      );

      expect(prismaService.payment.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentsByFilter);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(prismaService.payment, 'findMany')
        .mockRejectedValueOnce(new Error());

      try {
        await paymentRepository.findPaymentByFilter(mockProfessionalId, {
          appointmentDateFrom: mockGetPaymentFilter.appointmentDateFrom,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get payment');
      }
    });
  });

  describe('get payment by id', () => {
    it('should get payment successfully', async () => {
      jest
        .spyOn(prismaService.payment, 'findFirst')
        .mockResolvedValueOnce(mockPrismaGetPaymentResponse);

      const result = await paymentRepository.getPaymentById(
        mockGetPaymentResponse.id,
      );

      expect(prismaService.payment.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetPaymentResponse);
    });
  });
});

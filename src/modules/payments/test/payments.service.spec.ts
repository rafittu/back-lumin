import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentService } from '../services/create-payment.service';
import { FindPaymentByFilterService } from '../services/find-by-filter.service';
import { GetOnePaymentService } from '../services/get-one-payment.service';
import { UpdatePaymentService } from '../services/update-payment.service';
import { PaymentRepository } from '../repository/payment.repository';
import {
  mockAppointmentId,
  mockCreatePayment,
  mockGetPaymentFilter,
  mockGetPaymentResponse,
  mockManyPaymentsResponse,
  mockPaymentId,
  mockPaymentResponse,
  mockPaymentsByFilter,
  mockProfessionalId,
  mockUpdatePayment,
} from './mocks/service.mock';
import { AppError } from '../../../common/errors/Error';
import { CreateManyPaymentsService } from '../services/create-many-pmts.service';
import { mockAppointmentsIds } from './mocks/controller.mock';
import { PaymentStatus } from '../enum/payment-status.enum';

describe('PaymentsService', () => {
  let createPaymentService: CreatePaymentService;
  let createManyPaymentsService: CreateManyPaymentsService;
  let findPaymentByFilterService: FindPaymentByFilterService;
  let findOnePaymentService: GetOnePaymentService;
  let updatePaymentService: UpdatePaymentService;

  let paymentRepository: PaymentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentService,
        CreateManyPaymentsService,
        FindPaymentByFilterService,
        GetOnePaymentService,
        UpdatePaymentService,
        {
          provide: PaymentRepository,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(mockPaymentResponse),
            createManyPayments: jest
              .fn()
              .mockResolvedValue(mockManyPaymentsResponse),
            findPaymentByFilter: jest
              .fn()
              .mockResolvedValue(mockPaymentsByFilter),
            getPaymentById: jest.fn().mockResolvedValue(mockGetPaymentResponse),
            updatePayment: jest.fn().mockResolvedValue(mockGetPaymentResponse),
          },
        },
      ],
    }).compile();

    createPaymentService =
      module.get<CreatePaymentService>(CreatePaymentService);
    createManyPaymentsService = module.get<CreateManyPaymentsService>(
      CreateManyPaymentsService,
    );
    findPaymentByFilterService = module.get<FindPaymentByFilterService>(
      FindPaymentByFilterService,
    );
    findOnePaymentService =
      module.get<GetOnePaymentService>(GetOnePaymentService);
    updatePaymentService =
      module.get<UpdatePaymentService>(UpdatePaymentService);

    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(createPaymentService).toBeDefined();
    expect(createManyPaymentsService).toBeDefined();
    expect(findPaymentByFilterService).toBeDefined();
    expect(findOnePaymentService).toBeDefined();
    expect(updatePaymentService).toBeDefined();
  });

  describe('create payment', () => {
    it('should create a new payment successfully', async () => {
      const result = await createPaymentService.execute(
        mockProfessionalId,
        mockAppointmentId,
        mockCreatePayment,
      );

      expect(paymentRepository.createPayment).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentResponse);
    });

    it('should throw an AppError if missing params', async () => {
      try {
        await createPaymentService.execute(
          undefined,
          mockAppointmentId,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'Missing or invalid query parameter: professionalId',
        );
      }

      try {
        await createPaymentService.execute(
          mockProfessionalId,
          undefined,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'Missing or invalid query parameter: appointmentId',
        );
      }
    });

    it('should throw an AppError oppening an invalid payment', async () => {
      const modifiedCreatePayment = {
        ...mockCreatePayment,
        status: PaymentStatus.OPEN,
      };
      delete modifiedCreatePayment.totalPaid;
      delete modifiedCreatePayment.paymentDate;

      try {
        await createPaymentService.execute(
          mockProfessionalId,
          mockAppointmentId,
          modifiedCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'The properties totalPaid, paymentDate, and paymentMethod are not allowed when the payment status is OPEN',
        );
      }
    });

    it('should throw an AppError if request body is invalid', async () => {
      const modifiedCreatePayment = { ...mockCreatePayment };
      delete modifiedCreatePayment.totalPaid;

      try {
        await createPaymentService.execute(
          mockProfessionalId,
          mockAppointmentId,
          modifiedCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing values for fields: totalPaid');
      }
    });
  });

  describe('create many payments', () => {
    it('should create new payments successfully', async () => {
      const result = await createManyPaymentsService.execute(
        mockProfessionalId,
        mockAppointmentsIds,
        mockCreatePayment,
      );

      expect(paymentRepository.createManyPayments).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockManyPaymentsResponse);
    });

    it('should throw an AppError if missing params', async () => {
      try {
        await createManyPaymentsService.execute(
          undefined,
          mockAppointmentsIds,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'Missing or invalid query parameter: professionalId',
        );
      }

      try {
        await createManyPaymentsService.execute(
          mockProfessionalId,
          undefined,
          mockCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'Missing or invalid query parameter: appointmentsIds',
        );
      }
    });

    it('should throw an AppError oppening an invalid payment', async () => {
      const modifiedCreatePayment = {
        ...mockCreatePayment,
        status: PaymentStatus.OPEN,
      };
      delete modifiedCreatePayment.totalPaid;
      delete modifiedCreatePayment.paymentDate;

      try {
        await createManyPaymentsService.execute(
          mockProfessionalId,
          mockAppointmentsIds,
          modifiedCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'The properties totalPaid, paymentDate, and paymentMethod are not allowed when the status is OPEN',
        );
      }
    });

    it('should throw an AppError if request body is invalid', async () => {
      const invalidCreatePayment = {
        ...mockCreatePayment,
      };
      delete invalidCreatePayment.totalPaid;

      try {
        await createManyPaymentsService.execute(
          mockProfessionalId,
          mockAppointmentsIds,
          invalidCreatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing values for fields: totalPaid');
      }
    });
  });

  describe('find payments by filter', () => {
    it('should find payment by filter successfully', async () => {
      const result = await findPaymentByFilterService.execute(
        mockProfessionalId,
        mockGetPaymentFilter,
      );

      expect(paymentRepository.findPaymentByFilter).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentsByFilter);
    });

    it('should throw an AppError if missing params', async () => {
      try {
        await findPaymentByFilterService.execute(
          undefined,
          mockGetPaymentFilter,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'Missing or invalid query parameter: professionalId',
        );
      }
    });
  });

  describe('find payment by id', () => {
    it('should get payment successfully', async () => {
      const result = await findOnePaymentService.execute(
        mockPaymentResponse.id,
      );

      expect(paymentRepository.getPaymentById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetPaymentResponse);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(paymentRepository, 'getPaymentById')
        .mockRejectedValueOnce(new Error());

      await expect(
        findOnePaymentService.execute(mockPaymentResponse.id),
      ).rejects.toThrowError();
    });
  });

  describe('update payment', () => {
    it('should update payment successfully', async () => {
      mockGetPaymentResponse.status = PaymentStatus.OPEN;

      jest
        .spyOn(paymentRepository, 'getPaymentById')
        .mockResolvedValueOnce(mockGetPaymentResponse);

      const result = await updatePaymentService.execute(
        mockPaymentId,
        mockUpdatePayment,
      );

      expect(paymentRepository.updatePayment).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetPaymentResponse);
    });

    it('should revert a created payment to open successfully', async () => {
      jest
        .spyOn(paymentRepository, 'getPaymentById')
        .mockResolvedValueOnce(mockGetPaymentResponse);

      const modifiedBody = {
        status: PaymentStatus.OPEN,
      };

      const result = await updatePaymentService.execute(
        mockPaymentId,
        modifiedBody,
      );

      expect(paymentRepository.updatePayment).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetPaymentResponse);
    });

    it('should throw an AppError updating an open payment', async () => {
      mockGetPaymentResponse.status = PaymentStatus.OPEN;

      jest
        .spyOn(paymentRepository, 'getPaymentById')
        .mockResolvedValueOnce(mockGetPaymentResponse);

      const modifiedUpdatePayment = {
        ...mockUpdatePayment,
      };
      delete modifiedUpdatePayment.status;

      try {
        await updatePaymentService.execute(
          mockPaymentId,
          modifiedUpdatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'The properties totalPaid, paymentDate, and paymentMethod are not allowed when the payment status is OPEN',
        );
      }
    });

    it('should throw an AppError if request body is invalid', async () => {
      mockGetPaymentResponse.status = PaymentStatus.OPEN;

      jest
        .spyOn(paymentRepository, 'getPaymentById')
        .mockResolvedValueOnce(mockGetPaymentResponse);

      const modifiedUpdatePayment = { ...mockUpdatePayment };
      delete modifiedUpdatePayment.totalPaid;

      try {
        await updatePaymentService.execute(
          mockPaymentId,
          modifiedUpdatePayment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing values for fields: totalPaid');
      }
    });
  });
});

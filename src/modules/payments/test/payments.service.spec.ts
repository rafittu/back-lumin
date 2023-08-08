import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentService } from '../services/create-payment.service';
import { FindPaymentByFilterService } from '../services/find-by-filter.service';
import { GetOnePaymentService } from '../services/get-one-payment.service';
import { UpdatePaymentService } from '../services/update-payment.service';
import { PaymentRepository } from '../repository/payment.repository';
import {
  mockAppointmentId,
  mockCreatePayment,
  mockManyPaymentsResponse,
  mockPaymentResponse,
  mockProfessionalId,
} from './mocks/service.mock';
import { AppError } from '../../../common/errors/Error';
import { CreateManyPaymentsService } from '../services/create-many-pmts.service';
import { mockAppointmentsIds } from './mocks/controller.mock';

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
          'missing query parameter [professionalId, appointmentId]',
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

    // it('should throw an AppError if request body is invalid', async () => {
    //   delete mockCreatePayment.totalPaid;

    //   try {
    //     await createPaymentService.execute(
    //       mockProfessionalId,
    //       mockAppointmentId,
    //       mockCreatePayment,
    //     );
    //   } catch (error) {
    //     expect(error).toBeInstanceOf(AppError);
    //     expect(error.code).toBe(400);
    //     expect(error.message).toBe('missing values for fields: totalPaid');
    //   }
    // });
  });
});

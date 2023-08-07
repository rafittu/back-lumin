import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentService } from '../services/create-payment.service';
import { FindPaymentByFilterService } from '../services/find-by-filter.service';
import { GetOnePaymentService } from '../services/get-one-payment.service';
import { UpdatePaymentService } from '../services/update-payment.service';
import { PaymentRepository } from '../repository/payment.repository';
import {
  mockAppointmentId,
  mockCreatePayment,
  mockPaymentResponse,
  mockProfessionalId,
} from './mocks/service.mock';
import { AppError } from '../../../common/errors/Error';

describe('PaymentsService', () => {
  let createPaymentService: CreatePaymentService;
  let findPaymentByFilterService: FindPaymentByFilterService;
  let findOnePaymentService: GetOnePaymentService;
  let updatePaymentService: UpdatePaymentService;

  let paymentRepository: PaymentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreatePaymentService,
        FindPaymentByFilterService,
        GetOnePaymentService,
        UpdatePaymentService,
        {
          provide: PaymentRepository,
          useValue: {
            createPayment: jest.fn().mockResolvedValue(mockPaymentResponse),
          },
        },
      ],
    }).compile();

    createPaymentService =
      module.get<CreatePaymentService>(CreatePaymentService);
    findPaymentByFilterService = module.get<FindPaymentByFilterService>(
      FindPaymentByFilterService,
    );
    findOnePaymentService =
      module.get<GetOnePaymentService>(GetOnePaymentService);
    updatePaymentService =
      module.get<UpdatePaymentService>(UpdatePaymentService);

    paymentRepository = module.get<PaymentRepository>(PaymentRepository);
  });

  it('should be defined', () => {
    expect(createPaymentService).toBeDefined();
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
  });
});

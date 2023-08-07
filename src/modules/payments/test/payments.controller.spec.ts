import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { CreatePaymentService } from '../services/create-payment.service';
import {
  mockAppointmentId,
  mockCreatePayment,
  mockPaymentResponse,
  mockProfessionalId,
} from './mocks/controller.mock';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import { FindPaymentByFilterService } from '../services/find-by-filter.service';
import { GetOnePaymentService } from '../services/get-one-payment.service';
import { UpdatePaymentService } from '../services/update-payment.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  let createPaymentService: CreatePaymentService;
  let findPaymentByFilterService: FindPaymentByFilterService;
  let findOnePaymentService: GetOnePaymentService;
  let updatePaymentService: UpdatePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        RedisCacheService,
        {
          provide: CreatePaymentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockPaymentResponse),
          },
        },
        {
          provide: FindPaymentByFilterService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetOnePaymentService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdatePaymentService,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);

    createPaymentService =
      module.get<CreatePaymentService>(CreatePaymentService);
    findPaymentByFilterService = module.get<FindPaymentByFilterService>(
      FindPaymentByFilterService,
    );
    findOnePaymentService =
      module.get<GetOnePaymentService>(GetOnePaymentService);
    updatePaymentService =
      module.get<UpdatePaymentService>(UpdatePaymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create payment', () => {
    it('should create a new payment successfully', async () => {
      const result = await controller.create(
        mockProfessionalId,
        mockAppointmentId,
        mockCreatePayment,
      );

      expect(createPaymentService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentResponse);
    });
  });
});

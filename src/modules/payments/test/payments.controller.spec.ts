import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from '../payments.controller';
import { CreatePaymentService } from '../services/create-payment.service';
import {
  mockAppointmentId,
  mockAppointmentsIds,
  mockCreatePayment,
  mockGetPaymentFilter,
  mockGetPaymentResponse,
  mockManyPaymentsResponse,
  mockPaymentResponse,
  mockPaymentsByFilter,
  mockProfessionalId,
} from './mocks/controller.mock';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import { FindPaymentByFilterService } from '../services/find-by-filter.service';
import { GetOnePaymentService } from '../services/get-one-payment.service';
import { UpdatePaymentService } from '../services/update-payment.service';
import { CreateManyPaymentsService } from '../services/create-many-pmts.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  let createPaymentService: CreatePaymentService;
  let createManyPaymentsService: CreateManyPaymentsService;
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
          provide: CreateManyPaymentsService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockManyPaymentsResponse),
          },
        },
        {
          provide: FindPaymentByFilterService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockPaymentsByFilter),
          },
        },
        {
          provide: GetOnePaymentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockGetPaymentResponse),
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

    it('should throw an error', async () => {
      jest
        .spyOn(createPaymentService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.create(
          mockProfessionalId,
          mockAppointmentId,
          mockCreatePayment,
        ),
      ).rejects.toThrowError();
    });
  });

  describe('create many payments', () => {
    it('should create new payments successfully', async () => {
      const result = await controller.createMany(
        mockProfessionalId,
        mockAppointmentsIds,
        mockCreatePayment,
      );

      expect(createManyPaymentsService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockManyPaymentsResponse);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(createManyPaymentsService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.createMany(
          mockProfessionalId,
          mockAppointmentsIds,
          mockCreatePayment,
        ),
      ).rejects.toThrowError();
    });
  });

  describe('find payments by filter', () => {
    it('should get payments successfully', async () => {
      const result = await controller.findByFilter(
        mockProfessionalId,
        mockGetPaymentFilter,
      );

      expect(findPaymentByFilterService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaymentsByFilter);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(findPaymentByFilterService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findByFilter(mockProfessionalId, mockGetPaymentFilter),
      ).rejects.toThrowError();
    });
  });

  describe('get payment by id', () => {
    it('should get payment successfully', async () => {
      const result = await controller.findOne(mockPaymentResponse.id);

      expect(findOnePaymentService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetPaymentResponse);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(findOnePaymentService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findOne(mockPaymentResponse.id),
      ).rejects.toThrowError();
    });
  });
});

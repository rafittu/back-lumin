import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerController } from '../scheduler.controller';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import { CreateAppointmentService } from '../services/create-appt.service';
import {
  mockCreateAppointment,
  mockProfessionalId,
} from './mocks/controller.mock';
import { mockNewAppointment } from './mocks/common.mock';

describe('SchedulerController', () => {
  let controller: SchedulerController;

  let createAppointmentService: CreateAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulerController],
      providers: [
        RedisCacheService,
        {
          provide: CreateAppointmentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockNewAppointment),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulerController>(SchedulerController);

    createAppointmentService = module.get<CreateAppointmentService>(
      CreateAppointmentService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create an appointment', () => {
    it('should create a new appointment successfully', async () => {
      const result = await controller.create(
        mockCreateAppointment,
        mockProfessionalId,
      );

      expect(createAppointmentService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewAppointment);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(createAppointmentService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.create(mockCreateAppointment, mockProfessionalId),
      ).rejects.toThrowError();
    });
  });
});

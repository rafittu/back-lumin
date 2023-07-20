import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerController } from '../scheduler.controller';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import { CreateAppointmentService } from '../services/create-appt.service';

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
            execute: jest.fn(),
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
});

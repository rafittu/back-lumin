import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppointmentService } from '../services/create-appt.service';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { mockNewAppointment } from './mocks/common.mock';
import {
  mockCreateAppointment,
  mockProfessionalId,
} from './mocks/controller.mock';

describe('SchedulerService', () => {
  let createAppointmentService: CreateAppointmentService;

  let schedulerRepository: SchedulerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentService,
        {
          provide: SchedulerRepository,
          useValue: {
            createAppointment: jest.fn().mockResolvedValue(mockNewAppointment),
          },
        },
      ],
    }).compile();

    createAppointmentService = module.get<CreateAppointmentService>(
      CreateAppointmentService,
    );

    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);
  });

  it('should be defined', () => {
    expect(createAppointmentService).toBeDefined();
  });

  describe('create appointment', () => {
    it('should create a new one successfully', async () => {
      const result = await createAppointmentService.execute(
        mockProfessionalId,
        mockCreateAppointment,
      );

      expect(schedulerRepository.createAppointment).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewAppointment);
    });
  });
});

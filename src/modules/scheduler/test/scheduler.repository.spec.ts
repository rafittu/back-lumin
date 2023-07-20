import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { SchedulerRepository } from '../repository/scheduler.repository';
import { mockPrismaNewAppointment } from './mocks/repository.mock';
import {
  mockCreateAppointment,
  mockProfessionalId,
} from './mocks/controller.mock';
import { mockNewAppointment } from './mocks/common.mock';

describe('SchedulerRepository', () => {
  let schedulerRepository: SchedulerRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerRepository, PrismaService],
    }).compile();

    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(schedulerRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create an appointment', () => {
    it('should create a new appointment successfully', async () => {
      jest
        .spyOn(prismaService.scheduler, 'create')
        .mockResolvedValueOnce(mockPrismaNewAppointment);

      const result = await schedulerRepository.createAppointment(
        mockProfessionalId,
        mockCreateAppointment,
      );

      expect(prismaService.scheduler.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewAppointment);
    });
  });
});

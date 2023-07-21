import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { SchedulerRepository } from '../repository/scheduler.repository';
import {
  mockPrismaNewAppointment,
  mockPrismaProfessionalAppointments,
} from './mocks/repository.mock';
import {
  mockCreateAppointment,
  mockProfessionalId,
} from './mocks/controller.mock';
import {
  mockNewAppointment,
  mockProfessionalAppointments,
} from './mocks/common.mock';
import { AppError } from '../../../common/errors/Error';

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
        .spyOn(prismaService.scheduler, 'findFirst')
        .mockResolvedValueOnce(null);

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

    it('should throw an AppError when the requested appointment time is already booked', async () => {
      jest
        .spyOn(prismaService.scheduler, 'findFirst')
        .mockResolvedValueOnce(mockPrismaNewAppointment);

      try {
        await schedulerRepository.createAppointment(
          mockProfessionalId,
          mockCreateAppointment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe(
          'an appointment already exists at this time',
        );
      }
    });

    it('should throw an error if appointment is not booked', async () => {
      jest
        .spyOn(prismaService.scheduler, 'create')
        .mockRejectedValueOnce(new Error());

      try {
        await schedulerRepository.createAppointment(
          mockProfessionalId,
          mockCreateAppointment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to create appointment');
      }
    });
  });

  describe('find all professional appointments', () => {
    it('should get all appointments successfully', async () => {
      jest
        .spyOn(prismaService.scheduler, 'findMany')
        .mockResolvedValueOnce(mockPrismaProfessionalAppointments);

      const result = await schedulerRepository.findAllAppointments(
        mockProfessionalId,
      );

      expect(prismaService.scheduler.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(prismaService.scheduler, 'findMany')
        .mockRejectedValueOnce(new Error());

      try {
        await schedulerRepository.findAllAppointments(mockProfessionalId);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get appointments');
      }
    });
  });

  describe('get an appointment by filter', () => {
    it('should get an appointment by client name successfully', async () => {
      jest
        .spyOn(prismaService.scheduler, 'findMany')
        .mockResolvedValueOnce(mockPrismaProfessionalAppointments);

      const result = await schedulerRepository.getApptByFilter(
        mockProfessionalId,
        { clientName: mockNewAppointment.clientName },
      );

      expect(prismaService.scheduler.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });

    it('should get an appointment by appointment date successfully', async () => {
      jest
        .spyOn(prismaService.scheduler, 'findMany')
        .mockResolvedValueOnce(mockPrismaProfessionalAppointments);

      const result = await schedulerRepository.getApptByFilter(
        mockProfessionalId,
        { appointmentDate: mockNewAppointment.appointmentDate },
      );

      expect(prismaService.scheduler.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });

    it('should get an appointment by appointment time successfully', async () => {
      jest
        .spyOn(prismaService.scheduler, 'findMany')
        .mockResolvedValueOnce(mockPrismaProfessionalAppointments);

      const result = await schedulerRepository.getApptByFilter(
        mockProfessionalId,
        { appointmentTime: mockNewAppointment.appointmentTime },
      );

      expect(prismaService.scheduler.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });
  });
});

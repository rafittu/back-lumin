import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppointmentService } from '../services/create-appt.service';
import { SchedulerRepository } from '../repository/scheduler.repository';
import {
  mockNewAppointment,
  mockProfessionalAppointments,
} from './mocks/common.mock';
import {
  mockCreateAppointment,
  mockProfessionalId,
} from './mocks/controller.mock';
import { AppError } from '../../../common/errors/Error';
import { FindAllAppointmentService } from '../services/find-all-appts.service';
import { GetAppointmentByFilterService } from '../services/appt-by-filter.service';

describe('SchedulerService', () => {
  let createAppointmentService: CreateAppointmentService;
  let findAllAppointmentsService: FindAllAppointmentService;
  let getAppointmentByFilterService: GetAppointmentByFilterService;

  let schedulerRepository: SchedulerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentService,
        FindAllAppointmentService,
        GetAppointmentByFilterService,
        {
          provide: SchedulerRepository,
          useValue: {
            createAppointment: jest.fn().mockResolvedValue(mockNewAppointment),
            findAllAppointments: jest
              .fn()
              .mockResolvedValue(mockProfessionalAppointments),
            getApptByFilter: jest
              .fn()
              .mockResolvedValue(mockProfessionalAppointments),
          },
        },
      ],
    }).compile();

    createAppointmentService = module.get<CreateAppointmentService>(
      CreateAppointmentService,
    );
    findAllAppointmentsService = module.get<FindAllAppointmentService>(
      FindAllAppointmentService,
    );
    getAppointmentByFilterService = module.get<GetAppointmentByFilterService>(
      GetAppointmentByFilterService,
    );

    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);
  });

  it('should be defined', () => {
    expect(createAppointmentService).toBeDefined();
    expect(findAllAppointmentsService).toBeDefined();
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

    it('should throw an app error if missing params', async () => {
      try {
        await createAppointmentService.execute(
          undefined,
          mockCreateAppointment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing query parameter [professionalId]');
      }
    });
  });

  describe('find all appointments', () => {
    it('should get all professional appointments successfully', async () => {
      const result = await findAllAppointmentsService.execute(
        mockProfessionalId,
      );

      expect(schedulerRepository.findAllAppointments).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });
  });

  describe('get an appointment by filter', () => {
    it('should get an appointment by filter successfully', async () => {
      const result = await getAppointmentByFilterService.execute(
        mockProfessionalId,
        { clientName: mockNewAppointment.clientName },
      );

      expect(schedulerRepository.getApptByFilter).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });
  });
});

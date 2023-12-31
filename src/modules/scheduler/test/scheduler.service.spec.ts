import { Test, TestingModule } from '@nestjs/testing';
import { CreateAppointmentService } from '../services/create-appt.service';
import { SchedulerRepository } from '../repository/scheduler.repository';
import {
  mockInvalidDateTime,
  mockNewAppointment,
  mockProfessionalAppointments,
  mockUpdatedAppointment,
} from './mocks/common.mock';
import {
  mockCreateAppointment,
  mockProfessionalId,
  mockUpdateAppointment,
} from './mocks/controller.mock';
import { AppError } from '../../../common/errors/Error';
import { FindAllAppointmentService } from '../services/find-all-appts.service';
import { GetAppointmentByFilterService } from '../services/appt-by-filter.service';
import { UpdateAppointmentService } from '../services/update-appt.service';
import { DeleteAppointmentService } from '../services/delete-appt.service';

describe('SchedulerService', () => {
  let createAppointmentService: CreateAppointmentService;
  let findAllAppointmentsService: FindAllAppointmentService;
  let getAppointmentByFilterService: GetAppointmentByFilterService;
  let updateAppointmentService: UpdateAppointmentService;
  let deleteAppointmentService: DeleteAppointmentService;

  let schedulerRepository: SchedulerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAppointmentService,
        FindAllAppointmentService,
        GetAppointmentByFilterService,
        UpdateAppointmentService,
        DeleteAppointmentService,
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
            updateAppointment: jest
              .fn()
              .mockResolvedValue(mockUpdatedAppointment),
            deleteAppointment: jest
              .fn()
              .mockResolvedValue({ 'Appointment deleted': mockNewAppointment }),
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
    updateAppointmentService = module.get<UpdateAppointmentService>(
      UpdateAppointmentService,
    );
    deleteAppointmentService = module.get<DeleteAppointmentService>(
      DeleteAppointmentService,
    );

    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);
  });

  it('should be defined', () => {
    expect(createAppointmentService).toBeDefined();
    expect(findAllAppointmentsService).toBeDefined();
    expect(getAppointmentByFilterService).toBeDefined();
    expect(updateAppointmentService).toBeDefined();
    expect(deleteAppointmentService).toBeDefined();
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

    it('should throw an app error if appointment date or time is invalid', async () => {
      mockCreateAppointment.appointmentDate = mockInvalidDateTime;

      try {
        await createAppointmentService.execute(
          mockProfessionalId,
          mockCreateAppointment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'appointment date and time must be after the current date and time',
        );
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

  describe('update appointment', () => {
    it('should update an appointment successfully', async () => {
      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce({ appointments: [mockNewAppointment] });

      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce({ appointments: [] });

      const result = await updateAppointmentService.execute(
        mockNewAppointment.id,
        mockNewAppointment.professionalId,
        mockUpdateAppointment,
      );

      expect(schedulerRepository.updateAppointment).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedAppointment);
    });

    it('should throw an app error if missing params', async () => {
      try {
        await updateAppointmentService.execute(
          mockNewAppointment.id,
          undefined,
          mockUpdateAppointment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing query parameter [professionalId]');
      }
    });

    it('should throw an app error if appointment time already booked for another client', async () => {
      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce({ appointments: [mockNewAppointment] })
        .mockResolvedValueOnce({ appointments: [mockNewAppointment] });

      try {
        mockUpdateAppointment.appointmentDate = undefined;
        mockUpdateAppointment.appointmentTime = undefined;

        await updateAppointmentService.execute(
          mockNewAppointment.id,
          mockNewAppointment.professionalId,
          mockUpdateAppointment,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe(
          'an appointment already exists at this time',
        );
      }
    });
  });

  describe('delete an appointment', () => {
    it('should cancel an appointment successfully', async () => {
      const result = await deleteAppointmentService.execute(
        mockNewAppointment.id,
      );

      expect(schedulerRepository.deleteAppointment).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ 'Appointment deleted': mockNewAppointment });
    });
  });
});

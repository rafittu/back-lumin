import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerController } from '../scheduler.controller';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import { CreateAppointmentService } from '../services/create-appt.service';
import {
  mockCreateAppointment,
  mockProfessionalId,
  mockUpdateAppointment,
} from './mocks/controller.mock';
import {
  mockNewAppointment,
  mockProfessionalAppointments,
  mockUpdatedAppointment,
} from './mocks/common.mock';
import { FindAllAppointmentService } from '../services/find-all-appts.service';
import { GetAppointmentByFilterService } from '../services/appt-by-filter.service';
import { UpdateAppointmentService } from '../services/update-appt.service';

describe('SchedulerController', () => {
  let controller: SchedulerController;

  let createAppointmentService: CreateAppointmentService;
  let findAllAppointmentsService: FindAllAppointmentService;
  let getAppointmentByFilterService: GetAppointmentByFilterService;
  let updateAppointmentService: UpdateAppointmentService;

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
        {
          provide: FindAllAppointmentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProfessionalAppointments),
          },
        },
        {
          provide: GetAppointmentByFilterService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProfessionalAppointments),
          },
        },
        {
          provide: UpdateAppointmentService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUpdatedAppointment),
          },
        },
      ],
    }).compile();

    controller = module.get<SchedulerController>(SchedulerController);

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

  describe('get all appointments', () => {
    it('should get all professional appointments successfully', async () => {
      const result = await controller.findAllAppointments(mockProfessionalId);

      expect(findAllAppointmentsService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(findAllAppointmentsService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findAllAppointments(mockProfessionalId),
      ).rejects.toThrowError();
    });
  });

  describe('get an appointment by filter', () => {
    it('should get an appointment by filter successfully', async () => {
      const result = await controller.findAppointmentByFilter(
        mockProfessionalId,
        { clientName: mockNewAppointment.clientName },
      );

      expect(getAppointmentByFilterService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalAppointments);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(getAppointmentByFilterService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findAppointmentByFilter(mockProfessionalId, {
          clientName: mockNewAppointment.clientName,
        }),
      ).rejects.toThrowError();
    });
  });

  describe('update an appointment', () => {
    it('should update an appointment successfully', async () => {
      const result = await controller.update(
        mockNewAppointment.id,
        mockNewAppointment.professionalId,
        mockUpdateAppointment,
      );

      expect(updateAppointmentService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedAppointment);
    });

    // it('should throw an error', async () => {
    //   jest
    //     .spyOn(createAppointmentService, 'execute')
    //     .mockRejectedValueOnce(new Error());

    //   await expect(
    //     controller.create(mockCreateAppointment, mockProfessionalId),
    //   ).rejects.toThrowError();
    // });
  });
});

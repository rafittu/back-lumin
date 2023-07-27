import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../services/create-record.service';
import { RecordRepository } from '../repository/record.repository';
import { mockRepositoryRecordResponse } from './mocks/repository.mock';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import {
  mockFutureAppointment,
  mockNewRecord,
  mockProfessionalAppointments,
} from './mocks/common.mock';
import {
  mockAppointmentId,
  mockCreateRecord,
  mockProfessionalId,
} from './mocks/controller.mock';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';

describe('RecordServices', () => {
  let createRecordService: CreateRecordService;

  let recordRepository: RecordRepository;
  let schedulerRepository: SchedulerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecordService,
        {
          provide: SchedulerRepository,
          useValue: {
            getApptByFilter: jest
              .fn()
              .mockResolvedValue(mockProfessionalAppointments),
          },
        },
        {
          provide: RecordRepository,
          useValue: {
            createRecord: jest
              .fn()
              .mockResolvedValue(mockRepositoryRecordResponse),
          },
        },
      ],
    }).compile();

    createRecordService = module.get<CreateRecordService>(CreateRecordService);

    recordRepository = module.get<RecordRepository>(RecordRepository);
    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);
  });

  it('should be defined', () => {
    expect(createRecordService).toBeDefined();
  });

  describe('create record', () => {
    it('should create a new record successfully', async () => {
      const result = await createRecordService.execute(
        mockProfessionalId,
        mockAppointmentId,
        mockCreateRecord,
      );

      expect(recordRepository.createRecord).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewRecord);
    });

    it('should throw an AppError if missing params', async () => {
      try {
        await createRecordService.execute(
          undefined,
          mockAppointmentId,
          mockCreateRecord,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          'missing query parameter [professionalId, appointmentId]',
        );
      }
    });

    it('should throw an AppError if creating a record before the appointment date', async () => {
      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce(mockFutureAppointment);

      try {
        await createRecordService.execute(
          mockProfessionalId,
          mockAppointmentId,
          mockCreateRecord,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(422);
        expect(error.message).toBe(
          'cannot create a record before the appointment date',
        );
      }
    });

    it('should throw an AppError if record encryption fails', async () => {
      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce(mockProfessionalAppointments);

      jest.spyOn(crypto, 'createCipheriv').mockImplementation(() => {
        throw new Error('Error encrypting data');
      });

      try {
        await createRecordService.execute(
          mockProfessionalId,
          mockAppointmentId,
          mockCreateRecord,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
      }
    });
  });
});

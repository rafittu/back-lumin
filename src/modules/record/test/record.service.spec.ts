import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../services/create-record.service';
import { RecordRepository } from '../repository/record.repository';
import { mockRepositoryRecordResponse } from './mocks/repository.mock';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import {
  mockAllProfessionalRecords,
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
import { GetAllRecordsService } from '../services/all-records.service';

describe('RecordServices', () => {
  let createRecordService: CreateRecordService;
  let getAllRecordsService: GetAllRecordsService;

  let recordRepository: RecordRepository;
  let schedulerRepository: SchedulerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecordService,
        GetAllRecordsService,
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
            getAllRecords: jest
              .fn()
              .mockResolvedValue(mockAllProfessionalRecords),
          },
        },
      ],
    }).compile();

    createRecordService = module.get<CreateRecordService>(CreateRecordService);
    getAllRecordsService =
      module.get<GetAllRecordsService>(GetAllRecordsService);

    recordRepository = module.get<RecordRepository>(RecordRepository);
    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);
  });

  it('should be defined', () => {
    expect(createRecordService).toBeDefined();
    expect(getAllRecordsService).toBeDefined();
  });

  describe('create record', () => {
    it('should encrypt and create a new record successfully', async () => {
      process.env.RECORD_CIPHER_ALGORITHM = 'aes-256-cbc';
      process.env.RECORD_CIPHER_KEY = crypto.randomBytes(32).toString('hex');
      process.env.RECORD_CIPHER_IV = crypto.randomBytes(16).toString('hex');

      const mockCipher: crypto.Cipher = {
        update: jest.fn().mockReturnValue('encrypted-record'),
        final: jest.fn().mockReturnValue('final-encrypted-record'),
      } as any;

      jest.spyOn(crypto, 'createCipheriv').mockReturnValue(mockCipher);

      const result = await createRecordService.execute(
        mockProfessionalId,
        mockAppointmentId,
        mockCreateRecord,
      );

      delete process.env.RECORD_CIPHER_ALGORITHM;
      delete process.env.RECORD_CIPHER_KEY;
      delete process.env.RECORD_CIPHER_IV;

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

  describe('find all records', () => {
    it('should get all professional records successfully', async () => {
      const result = await getAllRecordsService.execute(mockProfessionalId);

      expect(recordRepository.getAllRecords).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAllProfessionalRecords);
    });
  });
});

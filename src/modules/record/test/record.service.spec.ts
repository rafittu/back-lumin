import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../services/create-record.service';
import { RecordRepository } from '../repository/record.repository';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import { AppError } from '../../../common/errors/Error';
import * as crypto from 'crypto';
import { GetAllRecordsService } from '../services/all-records.service';
import {
  mockAllProfessionalRecords,
  mockAppointmentId,
  mockCreateRecord,
  mockFutureAppointment,
  mockNewRecord,
  mockProfessionalAppointments,
  mockProfessionalId,
  mockProfessionalRecord,
  mockRepositoryRecordResponse,
} from './mocks/service.mock';
import { GetOneRecordService } from '../services/get-one-record.service';

describe('RecordServices', () => {
  let createRecordService: CreateRecordService;
  let getAllRecordsService: GetAllRecordsService;
  let getOneRecordService: GetOneRecordService;

  let recordRepository: RecordRepository;
  let schedulerRepository: SchedulerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecordService,
        GetAllRecordsService,
        GetOneRecordService,
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
            getOneRecord: jest.fn().mockResolvedValue(mockProfessionalRecord),
          },
        },
      ],
    }).compile();

    createRecordService = module.get<CreateRecordService>(CreateRecordService);
    getAllRecordsService =
      module.get<GetAllRecordsService>(GetAllRecordsService);
    getOneRecordService = module.get<GetOneRecordService>(GetOneRecordService);

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

    it('should throw an AppError if missing params', async () => {
      try {
        await getAllRecordsService.execute(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing query parameter [professionalId]');
      }
    });
  });

  describe('find one record', () => {
    it('should decrypt and get a record successfully', async () => {
      process.env.RECORD_CIPHER_ALGORITHM = 'aes-256-cbc';
      process.env.RECORD_CIPHER_KEY = crypto.randomBytes(32).toString('hex');
      process.env.RECORD_CIPHER_IV = crypto.randomBytes(16).toString('hex');

      const mockCipher: crypto.Cipher = {
        update: jest.fn().mockReturnValue('encrypted-record'),
        final: jest.fn().mockReturnValue('final-encrypted-record'),
      } as any;

      jest.spyOn(crypto, 'createDecipheriv').mockReturnValue(mockCipher);

      const result = await getOneRecordService.execute(
        mockNewRecord.recordId,
        mockProfessionalId,
      );

      expect(recordRepository.getOneRecord).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalRecord);
    });

    it('should throw an AppError if missing params', async () => {
      try {
        await getOneRecordService.execute(mockNewRecord.recordId, undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('missing query parameter [professionalId]');
      }
    });

    it('should throw an AppError if record does not belong to professionalId', async () => {
      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce(mockProfessionalAppointments);

      try {
        await getOneRecordService.execute(
          mockProfessionalRecord.recordId,
          mockProfessionalId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(403);
        expect(error.message).toBe(
          `record does not belong to the specified 'professionalId'`,
        );
      }
    });

    it('should throw an AppError if record encryption fails', async () => {
      jest
        .spyOn(recordRepository, 'getOneRecord')
        .mockResolvedValueOnce(mockProfessionalRecord);

      jest.spyOn(crypto, 'createDecipheriv').mockImplementation(() => {
        throw new Error('Error decrypting data');
      });

      try {
        mockProfessionalRecord.professionalId = mockProfessionalId;
        await getOneRecordService.execute(
          mockProfessionalRecord.recordId,
          mockProfessionalId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
      }
    });
  });
});

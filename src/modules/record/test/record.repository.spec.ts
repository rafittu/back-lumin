import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { RecordRepository } from '../repository/record.repository';
import {
  mockAllProfessionalRecords,
  mockAppointmentId,
  mockEncryptedRecord,
  mockPrismaGetOneProfessionalRecord,
  mockPrismaGetAllProfessionalRecord,
  mockPrismaNewRecord,
  mockProfessionalId,
  mockProfessionalRecord,
  mockRepositoryRecordResponse,
} from './mocks/repository.mock';
import { Prisma } from '@prisma/client';
import { AppError } from '../../../common/errors/Error';

describe('RecordRepository', () => {
  let recordRepository: RecordRepository;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordRepository, PrismaService],
    }).compile();

    recordRepository = module.get<RecordRepository>(RecordRepository);

    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(recordRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  describe('create record', () => {
    it('should create a new record successfully', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'create')
        .mockResolvedValueOnce(mockPrismaNewRecord);

      const result = await recordRepository.createRecord(
        mockProfessionalId,
        mockAppointmentId,
        mockEncryptedRecord,
      );

      expect(prismaService.appointmentRecord.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRepositoryRecordResponse);
    });

    it('should throw an AppError when a record already exists for an appointment', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'error message',
        {
          code: 'error code',
          clientVersion: '',
        },
      );

      jest
        .spyOn(prismaService.appointmentRecord, 'create')
        .mockRejectedValueOnce(prismaError);

      try {
        await recordRepository.createRecord(
          mockProfessionalId,
          mockAppointmentId,
          mockEncryptedRecord,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(409);
        expect(error.message).toBe(
          'a record for this appointment already exists',
        );
      }
    });

    it('should throw an error if record is not created', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'create')
        .mockRejectedValueOnce(new Error());

      try {
        await recordRepository.createRecord(
          mockProfessionalId,
          mockAppointmentId,
          mockEncryptedRecord,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to create record');
      }
    });
  });

  describe('find all records', () => {
    it('should get all professional records successfully', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'findMany')
        .mockResolvedValueOnce(mockPrismaGetAllProfessionalRecord);

      const result = await recordRepository.getAllRecords(mockProfessionalId);

      delete mockAllProfessionalRecords.records[0].record;

      expect(prismaService.appointmentRecord.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAllProfessionalRecords);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'findMany')
        .mockRejectedValueOnce(new Error());

      try {
        await recordRepository.getAllRecords(mockProfessionalId);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('failed to get records');
      }
    });
  });

  describe('get one record', () => {
    it('should get a record successfully', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'findFirst')
        .mockResolvedValueOnce(mockPrismaGetOneProfessionalRecord);

      const result = await recordRepository.getOneRecord(mockProfessionalId);

      expect(prismaService.appointmentRecord.findFirst).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toEqual(mockProfessionalRecord);
    });
  });
});

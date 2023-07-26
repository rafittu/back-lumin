import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { RecordRepository } from '../repository/record.repository';
import {
  mockPrismaNewRecord,
  mockRepositoryRecordResponse,
} from './mocks/repository.mock';
import { mockAppointmentId, mockProfessionalId } from './mocks/controller.mock';
import { mockEncryptedRecord } from './mocks/service.mock';

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
  });
});

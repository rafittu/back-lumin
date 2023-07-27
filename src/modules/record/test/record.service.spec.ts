import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../services/create-record.service';
import { RecordRepository } from '../repository/record.repository';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import { RepositoryRecord, mockNewRecord } from './mocks/common.mock';
import { mockProfessionalAppointments } from './mocks/service.mock';
import {
  mockAppointmentId,
  mockCreateRecord,
  mockProfessionalId,
} from './mocks/controller.mock';

describe('RecordServices', () => {
  let createRecordService: CreateRecordService;

  let recordRepository: RecordRepository;

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
            createRecord: jest.fn().mockResolvedValue(RepositoryRecord),
          },
        },
      ],
    }).compile();

    createRecordService = module.get<CreateRecordService>(CreateRecordService);

    recordRepository = module.get<RecordRepository>(RecordRepository);
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
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../services/create-record.service';
import { RecordRepository } from '../repository/record.repository';
import { mockRepositoryRecordResponse } from './mocks/repository.mock';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import { mockUserAppointment } from './mocks/common.mock';

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
            getApptByFilter: jest.fn().mockResolvedValue(mockUserAppointment),
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
  });

  it('should be defined', () => {
    expect(createRecordService).toBeDefined();
  });
});

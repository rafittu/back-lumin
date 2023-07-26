import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecordService } from '../services/create-record.service';
import { RecordRepository } from '../repository/record.repository';
import { mockRepositoryRecordResponse } from './mocks/repository.mock';
import { SchedulerRepository } from '../../../modules/scheduler/repository/scheduler.repository';
import {
  mockNewRecord,
  mockProfessionalAppointments,
  mockUserAppointment,
} from './mocks/common.mock';
import {
  mockAppointmentId,
  mockCreateRecord,
  mockProfessionalId,
} from './mocks/controller.mock';

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
    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);
  });

  it('should be defined', () => {
    expect(createRecordService).toBeDefined();
  });

  describe('create record', () => {
    it('should create a new record successfully', async () => {
      jest
        .spyOn(schedulerRepository, 'getApptByFilter')
        .mockResolvedValueOnce(mockProfessionalAppointments);

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

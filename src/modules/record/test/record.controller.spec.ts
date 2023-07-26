import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from '../record.controller';
import { CreateRecordService } from '../services/create-record.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import {
  mockAppointmentId,
  mockCreateRecord,
  mockProfessionalId,
} from './mocks/controller.mock';
import { mockNewRecord } from './mocks/common.mock';

describe('RecordController', () => {
  let controller: RecordController;

  let createRecordService: CreateRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [
        RedisCacheService,
        {
          provide: CreateRecordService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockNewRecord),
          },
        },
      ],
    }).compile();

    controller = module.get<RecordController>(RecordController);

    createRecordService = module.get<CreateRecordService>(CreateRecordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create record', () => {
    it('should create a new record successfully', async () => {
      const result = await controller.create(
        mockProfessionalId,
        mockAppointmentId,
        mockCreateRecord,
      );

      expect(createRecordService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewRecord);
    });
  });
});

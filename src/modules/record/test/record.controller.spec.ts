import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from '../record.controller';
import { CreateRecordService } from '../services/create-record.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import {
  mockAppointmentId,
  mockCreateRecord,
  mockProfessionalId,
} from './mocks/controller.mock';
import { mockAllProfessionalRecords, mockNewRecord } from './mocks/common.mock';
import { GetAllRecordsService } from '../services/all-records.service';

describe('RecordController', () => {
  let controller: RecordController;

  let createRecordService: CreateRecordService;
  let getAllRecordsService: GetAllRecordsService;

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
        {
          provide: GetAllRecordsService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockAllProfessionalRecords),
          },
        },
      ],
    }).compile();

    controller = module.get<RecordController>(RecordController);

    createRecordService = module.get<CreateRecordService>(CreateRecordService);
    getAllRecordsService =
      module.get<GetAllRecordsService>(GetAllRecordsService);
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

    it('should throw an error', async () => {
      jest
        .spyOn(createRecordService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.create(
          mockProfessionalId,
          mockAppointmentId,
          mockCreateRecord,
        ),
      ).rejects.toThrowError();
    });
  });

  describe('get all records', () => {
    it('should get all professional records successfully', async () => {
      const result = await controller.findAll(mockProfessionalId);

      expect(getAllRecordsService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAllProfessionalRecords);
    });
  });
});

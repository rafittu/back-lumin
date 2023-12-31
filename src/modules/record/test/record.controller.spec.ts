import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from '../record.controller';
import { CreateRecordService } from '../services/create-record.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import {
  mockAllProfessionalRecords,
  mockAppointmentId,
  mockCreateRecord,
  mockNewRecord,
  mockProfessionalId,
  mockProfessionalRecord,
  mockRecordFilter,
  mockUpdateRecord,
  mockUpdatedRecord,
} from './mocks/controller.mock';
import { GetAllRecordsService } from '../services/all-records.service';
import { GetOneRecordService } from '../services/get-one-record.service';
import { UpdateRecordService } from '../services/update-record.service';
import { ReencryptRecordsService } from '../services/reencrypt-record.service';
import { GetRecordByFilterService } from '../services/record-by-filter.service';

describe('RecordController', () => {
  let controller: RecordController;

  let createRecordService: CreateRecordService;
  let getAllRecordsService: GetAllRecordsService;
  let getOneRecordService: GetOneRecordService;
  let updateRecordService: UpdateRecordService;
  let reencryptRecordsService: ReencryptRecordsService;
  let getRecordByFilterService: GetRecordByFilterService;

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
        {
          provide: GetOneRecordService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProfessionalRecord),
          },
        },
        {
          provide: UpdateRecordService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUpdatedRecord),
          },
        },
        {
          provide: ReencryptRecordsService,
          useValue: {
            execute: jest
              .fn()
              .mockResolvedValue('Records reencrypted successfully'),
          },
        },
        {
          provide: GetRecordByFilterService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProfessionalRecord),
          },
        },
      ],
    }).compile();

    controller = module.get<RecordController>(RecordController);

    createRecordService = module.get<CreateRecordService>(CreateRecordService);
    getAllRecordsService =
      module.get<GetAllRecordsService>(GetAllRecordsService);
    getOneRecordService = module.get<GetOneRecordService>(GetOneRecordService);
    updateRecordService = module.get<UpdateRecordService>(UpdateRecordService);
    reencryptRecordsService = module.get<ReencryptRecordsService>(
      ReencryptRecordsService,
    );
    getRecordByFilterService = module.get<GetRecordByFilterService>(
      GetRecordByFilterService,
    );
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

    it('should throw an error', async () => {
      jest
        .spyOn(getAllRecordsService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findAll(mockProfessionalId),
      ).rejects.toThrowError();
    });
  });

  describe('get one record', () => {
    it('should get a record successfully', async () => {
      const result = await controller.findOne(
        mockProfessionalRecord.recordId,
        mockProfessionalId,
      );

      expect(getOneRecordService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalRecord);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(getOneRecordService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findOne(mockProfessionalRecord.recordId, mockProfessionalId),
      ).rejects.toThrowError();
    });
  });

  describe('update record', () => {
    it('should update a record successfully', async () => {
      const result = await controller.update(
        mockProfessionalRecord.recordId,
        mockUpdateRecord,
      );

      expect(updateRecordService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedRecord);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(updateRecordService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.update(mockProfessionalRecord.recordId, mockUpdateRecord),
      ).rejects.toThrowError();
    });
  });

  describe('reencrypt records', () => {
    it('should reencrypt all records successfully', async () => {
      const result = await controller.reencryptRecords();

      expect(reencryptRecordsService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual('Records reencrypted successfully');
    });

    it('should throw an error', async () => {
      jest
        .spyOn(reencryptRecordsService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(controller.reencryptRecords()).rejects.toThrowError();
    });
  });

  describe('get record by filter', () => {
    it('should get a record successfully', async () => {
      const result = await controller.findByFilter(
        mockProfessionalId,
        mockRecordFilter,
      );

      expect(getRecordByFilterService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalRecord);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(getRecordByFilterService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findByFilter(mockProfessionalId, mockRecordFilter),
      ).rejects.toThrowError();
    });
  });
});

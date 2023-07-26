import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from '../record.controller';
import { CreateRecordService } from '../services/create-record.service';

describe('RecordController', () => {
  let controller: RecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [CreateRecordService],
    }).compile();

    controller = module.get<RecordController>(RecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

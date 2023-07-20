import { Test, TestingModule } from '@nestjs/testing';

describe('SchedulerService', () => {
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

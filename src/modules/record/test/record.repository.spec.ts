import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { RecordRepository } from '../repository/record.repository';

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
});

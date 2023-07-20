import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { SchedulerRepository } from '../repository/scheduler.repository';

describe('SchedulerRepository', () => {
  let schedulerRepository: SchedulerRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerRepository, PrismaService],
    }).compile();

    schedulerRepository = module.get<SchedulerRepository>(SchedulerRepository);

    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(schedulerRepository).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  // describe('create admin user', () => {
  //   it('should create a new one successfully', async () => {
  //     jest
  //       .spyOn(userRepository, 'createUser')
  //       .mockResolvedValueOnce(mockNewAdminUser);

  //     const result = await createAdminService.execute(mockCreateUserBody);

  //     expect(userRepository.createUser).toHaveBeenCalledTimes(1);
  //     expect(result).toEqual(mockNewAdminUser);
  //   });
  // });
});

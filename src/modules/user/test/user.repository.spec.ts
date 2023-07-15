import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { UserRepository } from '../repository/user.repository';
import {
  mockAlmaUser,
  mockNewUser,
  mockPrismaCreatedUser,
} from './mocks/repository.mock';
import { UserRole } from '../enum/user-role.enum';
import { mockCreateUserBody } from './mocks/controller.mock';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRepository, PrismaService],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      jest
        .spyOn(userRepository as any, 'almaPostRequest')
        .mockResolvedValueOnce(mockAlmaUser);

      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(mockPrismaCreatedUser);

      const result = await userRepository.createUser(
        mockCreateUserBody,
        UserRole.CLIENT,
      );

      expect(userRepository['almaPostRequest']).toHaveBeenCalledTimes(1);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewUser);
    });
  });
});

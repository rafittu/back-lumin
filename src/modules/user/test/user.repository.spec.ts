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
import { AppError } from '../../../common/errors/Error';
import { Prisma } from '@prisma/client';

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

    it('should throw an AppError when almaPostRequest throws an error', async () => {
      jest
        .spyOn(userRepository as any, 'almaPostRequest')
        .mockRejectedValueOnce(
          new AppError('error.code', 500, 'Error message'),
        );

      try {
        await userRepository.createUser(mockCreateUserBody, UserRole.CLIENT);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe('Error message');
      }
    });

    it('should throw an AppError for PrismaClientKnownRequestError', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'error message',
        {
          code: 'error code',
          clientVersion: '',
        },
      );

      jest
        .spyOn(userRepository as any, 'almaPostRequest')
        .mockRejectedValueOnce(prismaError);

      try {
        await userRepository.createUser(mockCreateUserBody, UserRole.CLIENT);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
        expect(error.message).toBe(
          `[ '${error.meta?.target}' ] already in use`,
        );
      }
    });
  });
});

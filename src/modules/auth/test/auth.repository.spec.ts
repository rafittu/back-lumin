/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { AuthRepository } from '../repository/auth.repository';
import { RedisCacheService } from '../infra/cache/redis-cache.service';
import { mockAccessToken, mockUserCredentials } from './mocks/controller.mock';
import * as jwt from 'jsonwebtoken';
import { mockPrismaUser } from './mocks/repository.mock';

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthRepository, PrismaService, RedisCacheService],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authRepository).toBeDefined();
  });

  describe('signIn', () => {
    it('user should sign in successfully', async () => {
      jest
        .spyOn(authRepository as any, 'almaPostRequest')
        .mockResolvedValueOnce(mockAccessToken);

      jest.spyOn(jwt, 'verify').mockResolvedValueOnce(mockAccessToken as never);

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(mockPrismaUser);

      await authRepository.signIn(mockUserCredentials);

      expect(authRepository['almaPostRequest']).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
    });
  });
});

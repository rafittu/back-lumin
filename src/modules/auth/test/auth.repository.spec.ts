/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { AuthRepository } from '../repository/auth.repository';
import { RedisCacheService } from '../infra/cache/redis-cache.service';
import { mockAccessToken, mockUserCredentials } from './mocks/controller.mock';
import * as jwt from 'jsonwebtoken';
import {
  mockPrismaUser,
  mockSignInAxiosResponse,
} from './mocks/repository.mock';
import { AppError } from '../../../common/errors/Error';
import axios from 'axios';

jest.mock('axios');

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        PrismaService,
        {
          provide: RedisCacheService,
          useValue: {
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(authRepository).toBeDefined();
  });

  describe('handle alma api requests', () => {
    it('should make a post request and return response data', async () => {
      (
        axios.post as jest.MockedFunction<typeof axios.post>
      ).mockResolvedValueOnce(mockSignInAxiosResponse);

      const path = 'example.com/api';

      const result = await authRepository['almaRequest'](
        path,
        'post',
        mockUserCredentials,
      );

      expect(axios.post).toHaveBeenCalledWith(path, mockUserCredentials);
      expect(result).toEqual(mockSignInAxiosResponse.data);
    });

    it('should throw an AppError if request fails', async () => {
      (
        axios.post as jest.MockedFunction<typeof axios.post>
      ).mockRejectedValueOnce(AppError);

      const path = 'example.com/api/:id';

      try {
        await authRepository['almaRequest'](path, 'post', mockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('Internal server error');
      }
    });
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

    it('should throw an AppError when almaPostRequest throws an error', async () => {
      jest
        .spyOn(authRepository as any, 'almaPostRequest')
        .mockRejectedValueOnce(
          new AppError('error.code', 500, 'Error message'),
        );

      try {
        await authRepository.signIn(mockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(401);
        expect(error.message).toBe('Error message');
      }
    });

    it('should throw an error if user could not sign in', async () => {
      jest
        .spyOn(authRepository as any, 'almaPostRequest')
        .mockResolvedValueOnce(mockAccessToken);

      jest.spyOn(jwt, 'verify').mockResolvedValueOnce(mockAccessToken as never);

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockRejectedValueOnce(new Error());

      try {
        await authRepository.signIn(mockUserCredentials);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('internal server error');
      }
    });
  });

  // describe('almaPostRequest', () => {
  //   it('should make a post request and return response data', async () => {
  //     (
  //       axios.post as jest.MockedFunction<typeof axios.post>
  //     ).mockResolvedValueOnce(mockSignInAxiosResponse);

  //     const path = 'example.com/api';

  //     const result = await authRepository['almaPostRequest'](
  //       path,
  //       mockUserCredentials,
  //     );

  // expect(axios.post).toHaveBeenCalledWith(path, mockUserCredentials);
  // expect(result).toEqual(mockSignInAxiosResponse.data);
  //   });

  //   it('should throw an AppError if request fails', async () => {
  //     const errorResponse = {
  //       response: {
  //         data: {
  //           error: {
  //             status: 500,
  //             code: 'ERROR_CODE',
  //             message: 'Error message',
  //           },
  //         },
  //       },
  //     };

  //     (
  //       axios.post as jest.MockedFunction<typeof axios.post>
  //     ).mockRejectedValueOnce(errorResponse);

  //     const path = 'example.com/api';

  //     try {
  //       await authRepository['almaPostRequest'](path, mockUserCredentials);
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(AppError);
  //       expect(error.code).toBe('ERROR_CODE');
  //       expect(error.message).toBe('Error message');
  //     }
  //   });
  // });
});

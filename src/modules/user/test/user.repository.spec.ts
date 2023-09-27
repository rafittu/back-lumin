/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../prisma.service';
import { UserRepository } from '../repository/user.repository';
import {
  mockGetUser,
  mockAlmaUser,
  mockAlmaUserData,
  mockNewUser,
  mockPrismaUser,
  mockGetProfessionalClient,
  mockProfessionalClients,
  mockUserDataToUpdate,
  mockCreateUserAxiosResponse,
  mockGetUserAxiosResponse,
  mockUpdateUserAxiosResponse,
  mockUserInfo,
} from './mocks/repository.mock';
import { UserRole } from '../enum/user-role.enum';
import { mockAccessToken, mockCreateUserBody } from './mocks/controller.mock';
import { AppError } from '../../../common/errors/Error';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import axios from 'axios';

jest.mock('axios');

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

  describe('handle alma api requests', () => {
    it('should make a post request and return response data', async () => {
      (
        axios.post as jest.MockedFunction<typeof axios.post>
      ).mockResolvedValueOnce(mockCreateUserAxiosResponse);

      const path = 'example.com/api';

      const result = await userRepository['almaRequest'](
        path,
        null,
        'post',
        mockCreateUserBody,
      );

      expect(axios.post).toHaveBeenCalledWith(
        path,
        mockCreateUserBody,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${null}`,
          },
        }),
      );
      expect(result).toEqual(mockCreateUserAxiosResponse.data);
    });

    it('should make a get request and return response data', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockResolvedValueOnce(mockGetUserAxiosResponse);

      const path = 'example.com/api/:id';

      const result = await userRepository['almaRequest'](
        path,
        mockAccessToken,
        'get',
      );

      expect(axios.get).toHaveBeenCalledWith(
        path,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockAccessToken}`,
          },
        }),
      );
      expect(result).toEqual(mockGetUserAxiosResponse.data);
    });

    it('should throw an AppError if request fails', async () => {
      (
        axios.get as jest.MockedFunction<typeof axios.get>
      ).mockRejectedValueOnce(AppError);

      const path = 'example.com/api/:id';

      try {
        await userRepository['almaRequest'](path, mockAccessToken, 'patch');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('Internal server error');
      }
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      jest
        .spyOn(userRepository as any, 'almaRequest')
        .mockResolvedValueOnce(mockAlmaUser);

      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(mockPrismaUser);

      const result = await userRepository.createUser(
        mockCreateUserBody,
        UserRole.CLIENT,
      );

      expect(userRepository['almaRequest']).toHaveBeenCalledTimes(1);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewUser);
    });

    it('should throw an AppError when almaRequest throws an error', async () => {
      jest
        .spyOn(userRepository as any, 'almaRequest')
        .mockRejectedValueOnce(
          new AppError('error.code', 400, 'Error message'),
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
        .spyOn(userRepository as any, 'almaRequest')
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

    it('should throw an error if user is not created', async () => {
      jest
        .spyOn(userRepository as any, 'almaRequest')
        .mockResolvedValueOnce(mockAlmaUser);

      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValueOnce(new Error());

      try {
        await userRepository.createUser(mockCreateUserBody, UserRole.CLIENT);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('user not created');
      }
    });
  });

  describe('findById', () => {
    it('should find an user by id successfully', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(mockPrismaUser);

      const result = await userRepository.findById(mockPrismaUser.id);

      expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserInfo);
    });

    it('should throw a not found error', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValueOnce(null);

      try {
        await userRepository.findById(mockPrismaUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(404);
        expect(error.message).toBe('user not found');
      }
    });

    it('should throw an internal error', async () => {
      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockRejectedValueOnce(new Error());

      try {
        await userRepository.findById(mockPrismaUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get user');
      }
    });
  });

  describe('getUserByJwt', () => {
    it('should find an user by id successfully', async () => {
      jest
        .spyOn(jwt, 'verify')
        .mockResolvedValueOnce(mockPrismaUser.alma_id as never);

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(mockPrismaUser);

      jest
        .spyOn(userRepository as any, 'almaRequest')
        .mockResolvedValueOnce(mockAlmaUserData);

      const result = await userRepository.getUserByJwt(mockAccessToken);

      expect(userRepository['almaRequest']).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGetUser);
    });

    it('should throw an AppError when almaRequest throws an error', async () => {
      jest
        .spyOn(jwt, 'verify')
        .mockResolvedValueOnce(mockPrismaUser.alma_id as never);

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockResolvedValueOnce(mockPrismaUser);

      jest
        .spyOn(userRepository as any, 'almaRequest')
        .mockRejectedValueOnce(
          new AppError('error.code', 500, 'Error message'),
        );

      try {
        await userRepository.getUserByJwt(mockAccessToken);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('Error message');
      }
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(jwt, 'verify')
        .mockResolvedValueOnce(mockPrismaUser.alma_id as never);

      jest
        .spyOn(prismaService.user, 'findFirst')
        .mockRejectedValueOnce(new Error());

      try {
        await userRepository.getUserByJwt(mockAccessToken);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get user');
      }
    });
  });

  describe('getClients', () => {
    it('should find all professional clients successfully', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'findMany')
        .mockResolvedValueOnce(mockGetProfessionalClient);

      const result = await userRepository.getClients(
        mockGetProfessionalClient[0].id,
      );

      expect(prismaService.appointmentRecord.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalClients);
    });

    it('should throw an error if clients is not found', async () => {
      jest
        .spyOn(prismaService.appointmentRecord, 'findMany')
        .mockRejectedValueOnce(new Error());

      try {
        await userRepository.getClients(mockPrismaUser.id);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(500);
        expect(error.message).toBe('could not get clients');
      }
    });
  });

  // describe('updateUser', () => {
  //   it('should update an user successfully', async () => {
  //     jest
  //       .spyOn(jwt, 'verify')
  //       .mockResolvedValueOnce(mockPrismaUser.alma_id as never);

  //     jest
  //       .spyOn(userRepository as any, 'almaPatchRequest')
  //       .mockResolvedValueOnce(mockAlmaUserData);

  //     jest
  //       .spyOn(prismaService.user, 'update')
  //       .mockResolvedValueOnce(mockPrismaUser);

  //     const result = await userRepository.updateUser(
  //       mockPrismaUser.id,
  //       mockAccessToken,
  //       mockUserDataToUpdate,
  //     );

  //     result.id = mockAlmaUserData.id;

  //     expect(userRepository['almaPatchRequest']).toHaveBeenCalledTimes(1);
  //     expect(prismaService.user.update).toHaveBeenCalledTimes(1);
  //     expect(result).toEqual(mockAlmaUserData);
  //   });

  //   it('should throw an AppError when almaPatchRequest throws an error', async () => {
  //     jest
  //       .spyOn(jwt, 'verify')
  //       .mockResolvedValueOnce(mockPrismaUser.alma_id as never);

  //     jest
  //       .spyOn(userRepository as any, 'almaPatchRequest')
  //       .mockRejectedValueOnce(
  //         new AppError('error.code', 500, 'Error message'),
  //       );

  //     try {
  //       await userRepository.updateUser(
  //         mockPrismaUser.id,
  //         mockAccessToken,
  //         mockUserDataToUpdate,
  //       );
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(AppError);
  //       expect(error.code).toBe(400);
  //       expect(error.message).toBe('Error message');
  //     }
  //   });

  //   it('should throw an error if user not updated', async () => {
  //     jest
  //       .spyOn(jwt, 'verify')
  //       .mockResolvedValueOnce(mockPrismaUser.alma_id as never);

  //     jest
  //       .spyOn(userRepository as any, 'almaPatchRequest')
  //       .mockResolvedValueOnce(mockAlmaUserData);

  //     jest
  //       .spyOn(prismaService.user, 'update')
  //       .mockRejectedValueOnce(new Error());

  //     try {
  //       await userRepository.updateUser(
  //         mockPrismaUser.id,
  //         mockAccessToken,
  //         mockUserDataToUpdate,
  //       );
  //     } catch (error) {
  //       expect(error).toBeInstanceOf(AppError);
  //       expect(error.code).toBe(500);
  //       expect(error.message).toBe('could not update user');
  //     }
  //   });
  // });
});

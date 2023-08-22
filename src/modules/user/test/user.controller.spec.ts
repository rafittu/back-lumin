import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { CreateAdminUserService } from '../services/user-admin.service';
import { CreateClientUserService } from '../services/user-client.service';
import { GetUserByJwtService } from '../services/get-user-by-jwt.service';
import { GetClientsService } from '../services/get-clients.service';
import { UpdateUserService } from '../services/update-user.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import {
  mockAccessToken,
  mockCreateUserBody,
  mockNewAdminUser,
  mockNewClientUser,
  mockProfessionalClients,
  mockUpdateUser,
  mockUpdatedUser,
  mockUserData,
  mockUserInfo,
} from './mocks/controller.mock';
import { FindUserByIdService } from '../services/find-user-by-id.service';

describe('UserController', () => {
  let controller: UserController;

  let createAdminService: CreateAdminUserService;
  let createClientService: CreateClientUserService;
  let getUserByJwtService: GetUserByJwtService;
  let getClientsService: GetClientsService;
  let updateUserService: UpdateUserService;
  let findUserByIdService: FindUserByIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        RedisCacheService,
        {
          provide: CreateAdminUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockNewAdminUser),
          },
        },
        {
          provide: CreateClientUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockNewClientUser),
          },
        },
        {
          provide: GetUserByJwtService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserData),
          },
        },
        {
          provide: GetClientsService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockProfessionalClients),
          },
        },
        {
          provide: UpdateUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUpdatedUser),
          },
        },
        {
          provide: FindUserByIdService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUserInfo),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createAdminService = module.get<CreateAdminUserService>(
      CreateAdminUserService,
    );
    createClientService = module.get<CreateClientUserService>(
      CreateClientUserService,
    );
    getUserByJwtService = module.get<GetUserByJwtService>(GetUserByJwtService);
    getClientsService = module.get<GetClientsService>(GetClientsService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
    findUserByIdService = module.get<FindUserByIdService>(FindUserByIdService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create admin user', () => {
    it('should create a new one successfully', async () => {
      const result = await controller.createAdminUser(mockCreateUserBody);

      expect(createAdminService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewAdminUser);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(createAdminService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.createAdminUser(mockCreateUserBody),
      ).rejects.toThrowError();
    });
  });

  describe('create client user', () => {
    it('should create a new one successfully', async () => {
      const result = await controller.createClientUser(mockCreateUserBody);

      expect(createClientService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNewClientUser);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(createClientService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.createClientUser(mockCreateUserBody),
      ).rejects.toThrowError();
    });
  });

  describe('find user by id', () => {
    it('should get an user successfully', async () => {
      const result = await controller.findUserById(mockNewClientUser.id);

      expect(findUserByIdService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserInfo);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(findUserByIdService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findUserById(mockNewClientUser.id),
      ).rejects.toThrowError();
    });
  });

  describe('get user by access token', () => {
    it('should get an user successfully', async () => {
      const result = await controller.GetUserByJwt(mockAccessToken);

      expect(getUserByJwtService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserData);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(getUserByJwtService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.GetUserByJwt(mockAccessToken),
      ).rejects.toThrowError();
    });
  });

  describe('find all professional clients', () => {
    it('should get clients successfully', async () => {
      const result = await controller.findAllProfessionalClients(
        mockNewAdminUser.id,
      );

      expect(getClientsService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalClients);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(getClientsService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.findAllProfessionalClients(mockNewClientUser.id),
      ).rejects.toThrowError();
    });
  });

  describe('update user', () => {
    it('should update successfully', async () => {
      const result = await controller.update(
        mockUserData.id,
        mockAccessToken,
        mockUpdateUser,
      );

      expect(updateUserService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(updateUserService, 'execute')
        .mockRejectedValueOnce(new Error());

      await expect(
        controller.update(mockUserData.id, mockAccessToken, mockUpdateUser),
      ).rejects.toThrowError();
    });
  });
});

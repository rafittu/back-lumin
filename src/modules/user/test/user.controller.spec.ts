import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { CreateAdminUserService } from '../services/user-admin.service';
import { CreateClientUserService } from '../services/user-client.service';
import { GetUserService } from '../services/get-user.service';
import { GetClientsService } from '../services/get-clients.service';
import { UpdateUserService } from '../services/update-user.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import {
  mockAccessToken,
  mockCreateUserBody,
  mockNewAdminUser,
  mockNewClientUser,
  mockProfessionalClients,
  mockUserData,
} from './mocks/controller.mock';

describe('UserController', () => {
  let controller: UserController;

  let createAdminService: CreateAdminUserService;
  let createClientService: CreateClientUserService;
  let getUserService: GetUserService;
  let getClientsService: GetClientsService;
  let updateUserService: UpdateUserService;

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
          provide: GetUserService,
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
            execute: jest.fn(),
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
    getUserService = module.get<GetUserService>(GetUserService);
    getClientsService = module.get<GetClientsService>(GetClientsService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
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
      const result = await controller.findUser(
        mockNewClientUser.id,
        mockAccessToken,
      );

      expect(getUserService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserData);
    });

    it('should throw an error', async () => {
      jest.spyOn(getUserService, 'execute').mockRejectedValueOnce(new Error());

      await expect(
        controller.findUser(mockNewClientUser.id, mockAccessToken),
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
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { CreateAdminUserService } from '../services/user-admin.service';
import { CreateClientUserService } from '../services/user-client.service';
import { GetUserService } from '../services/get-user.service';
import { GetClientsService } from '../services/get-clients.service';
import { UpdateUserService } from '../services/update-user.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';

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
            execute: jest.fn(),
          },
        },
        {
          provide: CreateClientUserService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetUserService,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetClientsService,
          useValue: {
            execute: jest.fn(),
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
});

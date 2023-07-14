import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminUserService } from '../services/user-admin.service';
import { CreateClientUserService } from '../services/user-client.service';
import { GetUserService } from '../services/get-user.service';
import { GetClientsService } from '../services/get-clients.service';
import { UpdateUserService } from '../services/update-user.service';
import { UserRepository } from '../repository/user.repository';

describe('UserServices', () => {
  let createAdminService: CreateAdminUserService;
  let createClientService: CreateClientUserService;
  let getUserService: GetUserService;
  let getClientsService: GetClientsService;
  let updateUserService: UpdateUserService;

  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAdminUserService,
        CreateClientUserService,
        GetUserService,
        GetClientsService,
        UpdateUserService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            getUser: jest.fn(),
            getClients: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

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
    expect(createAdminService).toBeDefined();
    expect(createClientService).toBeDefined();
    expect(getUserService).toBeDefined();
    expect(getClientsService).toBeDefined();
    expect(updateUserService).toBeDefined();
  });
});

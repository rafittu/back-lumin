import { Test, TestingModule } from '@nestjs/testing';
import { CreateAdminUserService } from '../services/user-admin.service';
import { CreateClientUserService } from '../services/user-client.service';
import { GetUserByJwtService } from '../services/get-user-by-jwt.service';
import { GetClientsService } from '../services/get-clients.service';
import { UpdateUserService } from '../services/update-user.service';
import { UserRepository } from '../repository/user.repository';
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
import { AuthRepository } from '../../../modules/auth/repository/auth.repository';
import { AppError } from '../../../common/errors/Error';
import { FindUserByIdService } from '../services/find-user-by-id.service';

describe('UserService', () => {
  let createAdminService: CreateAdminUserService;
  let createClientService: CreateClientUserService;
  let getUserByJwtService: GetUserByJwtService;
  let getClientsService: GetClientsService;
  let updateUserService: UpdateUserService;
  let findUserByIdService: FindUserByIdService;

  let userRepository: UserRepository;
  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateAdminUserService,
        CreateClientUserService,
        GetUserByJwtService,
        GetClientsService,
        UpdateUserService,
        FindUserByIdService,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn(),
            getUserByJwt: jest.fn().mockResolvedValue(mockUserData),
            getClients: jest.fn().mockResolvedValue(mockProfessionalClients),
            updateUser: jest.fn().mockResolvedValue(mockUpdatedUser),
            findById: jest.fn().mockResolvedValue(mockUserInfo),
          },
        },
        {
          provide: AuthRepository,
          useValue: {
            signIn: jest.fn().mockResolvedValue('accessToken'),
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
    getUserByJwtService = module.get<GetUserByJwtService>(GetUserByJwtService);
    getClientsService = module.get<GetClientsService>(GetClientsService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
    findUserByIdService = module.get<FindUserByIdService>(FindUserByIdService);

    userRepository = module.get<UserRepository>(UserRepository);
    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(createAdminService).toBeDefined();
    expect(createClientService).toBeDefined();
    expect(getUserByJwtService).toBeDefined();
    expect(getClientsService).toBeDefined();
    expect(updateUserService).toBeDefined();
    expect(findUserByIdService).toBeDefined();
  });

  describe('create admin user', () => {
    it('should create a new one successfully', async () => {
      process.env.ADMIN_SIGNUP_TOKEN = 'admin_signup_token';

      jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValueOnce(mockNewAdminUser);

      const result = await createAdminService.execute(mockCreateUserBody);

      delete process.env.ADMIN_SIGNUP_TOKEN;

      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
      expect(authRepository.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual('accessToken');
    });

    it('should throw an error if missing signup token', async () => {
      process.env.ADMIN_SIGNUP_TOKEN = 'admin_signup_token';

      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValueOnce(new Error());

      const modifiedCreateUserBody = {
        ...mockCreateUserBody,
      };

      delete modifiedCreateUserBody.signupToken;

      try {
        await createAdminService.execute(modifiedCreateUserBody);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
      }
    });

    it('should throw an error', async () => {
      process.env.ADMIN_SIGNUP_TOKEN = 'admin_signup_token';
      mockCreateUserBody.signupToken = 'admin_signup_token';

      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValueOnce(new Error());

      try {
        await createAdminService.execute(mockCreateUserBody);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
      }
    });
  });

  describe('create client user', () => {
    it('should create a new one successfully', async () => {
      jest
        .spyOn(userRepository, 'createUser')
        .mockResolvedValueOnce(mockNewClientUser);

      const result = await createClientService.execute(mockCreateUserBody);

      expect(userRepository.createUser).toHaveBeenCalledTimes(1);
      expect(authRepository.signIn).toHaveBeenCalledTimes(1);
      expect(result).toEqual('accessToken');
    });

    it('should throw an error', async () => {
      jest
        .spyOn(userRepository, 'createUser')
        .mockRejectedValueOnce(new Error());

      try {
        await createClientService.execute(mockCreateUserBody);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error.code).toBe(400);
      }
    });
  });

  describe('find user by id', () => {
    it('should get an user successfully', async () => {
      const result = await findUserByIdService.execute(mockNewClientUser.id);

      expect(userRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserInfo);
    });
  });

  describe('get user by jwt', () => {
    it('should get an user successfully', async () => {
      const result = await getUserByJwtService.execute(mockAccessToken);

      expect(userRepository.getUserByJwt).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserData);
    });
  });

  describe('find all professional clients', () => {
    it('should get clients successfully', async () => {
      const result = await getClientsService.execute(mockNewAdminUser.id);

      expect(userRepository.getClients).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProfessionalClients);
    });
  });

  describe('update user', () => {
    it('should update an user successfully', async () => {
      const result = await updateUserService.execute(
        mockUserData.id,
        mockAccessToken,
        mockUpdateUser,
      );

      expect(userRepository.updateUser).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedUser);
    });
  });
});

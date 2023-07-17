import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { SignInService } from '../services/signin.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';
import { mockAccessToken, mockUserCredentials } from './mocks/controller.mock';

describe('AuthController', () => {
  let controller: AuthController;

  let signInService: SignInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        RedisCacheService,
        {
          provide: SignInService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockAccessToken),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    signInService = module.get<SignInService>(SignInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('user signin', () => {
    it('user should sign in successfully', async () => {
      const result = await controller.signIn(mockUserCredentials);

      expect(signInService.execute).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockAccessToken);
    });
  });
});

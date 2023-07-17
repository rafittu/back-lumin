import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { SignInService } from '../services/signin.service';
import { RedisCacheService } from '../../../modules/auth/infra/cache/redis-cache.service';

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
            execute: jest.fn(),
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
});

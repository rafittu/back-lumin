import { Test, TestingModule } from '@nestjs/testing';
import { SignInService } from '../services/signin.service';
import { AuthRepository } from '../repository/auth.repository';

describe('AuthService', () => {
  let signInService: SignInService;

  let authRepository: AuthRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignInService,
        {
          provide: AuthRepository,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    signInService = module.get<SignInService>(SignInService);

    authRepository = module.get<AuthRepository>(AuthRepository);
  });

  it('should be defined', () => {
    expect(signInService).toBeDefined();
  });
});

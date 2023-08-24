import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { AuthRepository } from '../../../modules/auth/repository/auth.repository';
import { JwtToken } from '../../../modules/auth/interfaces/auth.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class CreateAdminUserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(data: CreateUserDto): Promise<JwtToken> {
    const adminSignupToken = process.env.ADMIN_SIGNUP_TOKEN;
    const { signupToken } = data;

    if (!signupToken || signupToken !== adminSignupToken) {
      throw new AppError(
        'user-service.createAdminUser',
        400,
        'missing or invalid signup token',
      );
    }

    try {
      await this.userRepository.createUser(data, UserRole.ADMIN);

      const accessToken = await this.authRepository.signIn({
        email: data.email,
        password: data.password,
      });

      return accessToken;
    } catch (error) {
      throw new AppError('user-service.createAdminUser', 400, error.message);
    }
  }
}

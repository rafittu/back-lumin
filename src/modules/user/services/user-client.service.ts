import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { AuthRepository } from '../../../modules/auth/repository/auth.repository';
import { JwtToken } from '../../../modules/auth/interfaces/auth.interface';
import { AppError } from '../../../common/errors/Error';

@Injectable()
export class CreateClientUserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  async execute(data: CreateUserDto): Promise<JwtToken> {
    try {
      await this.userRepository.createUser(data, UserRole.CLIENT);

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

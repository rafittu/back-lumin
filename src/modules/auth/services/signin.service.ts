import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { IAuthRepository } from '../interfaces/repository.interface';
import { JwtToken, UserCredentials } from '../interfaces/auth.interface';

@Injectable()
export class SignInService {
  constructor(
    @Inject(AuthRepository)
    private authRepository: IAuthRepository,
  ) {}

  execute(credentials: UserCredentials): Promise<JwtToken> {
    return this.authRepository.signIn(credentials);
  }
}

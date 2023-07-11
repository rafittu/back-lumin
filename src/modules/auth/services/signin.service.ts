import { Inject, Injectable } from '@nestjs/common';
import { AuthRepository } from '../repository/auth.repository';
import { IAuthRepository } from '../interfaces/repository.interface';

@Injectable()
export class SignInService {
  constructor(
    @Inject(AuthRepository)
    private authRepository: IAuthRepository,
  ) {}

  execute(credentialsDto) {
    return this.authRepository.signIn(credentialsDto);
  }
}

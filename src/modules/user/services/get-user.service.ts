import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';

@Injectable()
export class GetUserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(userId: string, accessToken: string) {
    return this.userRepository.getUser(userId, accessToken);
  }
}

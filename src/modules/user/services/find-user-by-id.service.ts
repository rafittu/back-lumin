import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { UserInfo } from '../interfaces/user.interface';

@Injectable()
export class FindUserByIdService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(userId: string): Promise<UserInfo> {
    return this.userRepository.findById(userId);
  }
}

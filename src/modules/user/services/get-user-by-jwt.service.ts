import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { UserData } from '../interfaces/user.interface';

@Injectable()
export class GetUserByJwtService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(accessToken: string): Promise<UserData> {
    return this.userRepository.getUserByJwt(accessToken);
  }
}

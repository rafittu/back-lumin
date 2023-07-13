import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(userId: string, accessToken: string, dataToUpdate: UpdateUserDto) {
    return this.userRepository.updateUser(userId, accessToken, dataToUpdate);
  }
}

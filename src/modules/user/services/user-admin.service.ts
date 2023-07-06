import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { IUserRepository } from '../interfaces/repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../interfaces/user.interface';
import { UserRole } from '../enum/user-role.enum';

@Injectable()
export class CreateAdminUserService {
  constructor(
    @Inject(UserRepository)
    private userRepository: IUserRepository,
  ) {}

  execute(data: CreateUserDto): Promise<User> {
    return this.userRepository.createUser(data, UserRole.ADMIN);
  }
}

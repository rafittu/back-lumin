import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';

import { AppError } from '../../../common/errors/Error';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import {
  PostAlmaUser,
  IUserRepository,
} from '../interfaces/repository.interface';
import { AdminUser } from '../interfaces/user.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private async almaPostRequest(
    path: string,
    data: any,
  ): Promise<PostAlmaUser> {
    try {
      const response = await axios.post(path, data);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createAdminUser(
    data: CreateUserDto,
    role: UserRole,
  ): Promise<AdminUser> {
    try {
      // create alma user
      // format alma user
      // create lumin user

      return 'user';
    } catch (error) {
      throw new AppError(
        'user-repository.createAdminUser',
        500,
        'user not created',
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { IUserRepository, AlmaUser } from '../interfaces/repository.interface';
import { AdminUser } from '../interfaces/user.interface';
import axios from 'axios';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private async almaPostRequest(path: string, body: object): Promise<AlmaUser> {
    try {
      const response = await axios.post(path, body);
      return response.data;
    } catch (error) {
      throw new AppError(
        error.response.data.error.status,
        error.response.data.error.code,
        error.response.data.error.message,
      );
    }
  }

  async createAdminUser(
    createUser: CreateUserDto,
    role: UserRole,
  ): Promise<AdminUser> {
    const signUpPath: string = process.env.SIGNUP_PATH;

    try {
      const user = await this.almaPostRequest(signUpPath, createUser);

      // format alma user
      // create lumin user

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError(
          'user-repository.createAdminUser',
          400,
          error.message,
        );
      }

      throw new AppError(
        'user-repository.createAdminUser',
        500,
        'user not created',
      );
    }
  }
}

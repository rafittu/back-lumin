import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { IUserRepository, AlmaUser } from '../interfaces/repository.interface';
import { User } from '../interfaces/user.interface';
import axios from 'axios';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private async almaPostRequest(path: string, body: object): Promise<AlmaUser> {
    try {
      const response = await axios.post(path, body);
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  async createAdminUser(
    createUser: CreateUserDto,
    role: UserRole,
  ): Promise<User> {
    const signUpPath: string = process.env.SIGNUP_PATH;

    try {
      const almaUser = await this.almaPostRequest(signUpPath, createUser);

      const user = await this.prisma.user.create({
        data: {
          alma_id: almaUser.id,
          name: `${createUser.firstName} ${createUser.lastName}`,
          social_name: createUser.socialName,
          role,
        },
      });

      const { id, alma_id, name, social_name, created_at, updated_at } = user;
      const userResponse = {
        id: id,
        almaId: alma_id,
        name: name,
        socialName: social_name,
        email: createUser.email,
        role,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return userResponse;
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

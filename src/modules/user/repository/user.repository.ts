import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import { AppError } from '../../../common/errors/Error';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import {
  IUserRepository,
  AlmaUser,
  AlmaUserData,
  AlmaUserUpdated,
} from '../interfaces/repository.interface';
import {
  ProfessionalClients,
  UpdatedUser,
  User,
  UserData,
  UserInfo,
} from '../interfaces/user.interface';
import axios from 'axios';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  private async almaRequest<T>(
    path: string,
    accessToken: string,
    method: 'post' | 'get' | 'patch',
    body?: object,
  ): Promise<T> {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response =
        method === 'post'
          ? await axios.post(path, body, config)
          : method === 'patch'
          ? await axios.patch(path, body, config)
          : await axios.get(path, config);

      return response.data;
    } catch (error) {
      const { status, code, message } = error.response?.data?.error || {};
      throw new AppError(status, code, message);
    }
  }

  async createUser(createUser: CreateUserDto, role: UserRole): Promise<User> {
    const signUpPath: string = process.env.SIGNUP_PATH;

    try {
      const almaUser = await this.almaRequest<AlmaUser>(
        signUpPath,
        null,
        'post',
        createUser,
      );

      const user = await this.prisma.user.create({
        data: {
          alma_id: almaUser.id,
          name: `${createUser.firstName} ${createUser.lastName}`,
          social_name: createUser.socialName,
          role,
        },
      });

      const { id, alma_id, name, social_name, created_at, updated_at } = user;
      const userResponse: User = {
        id,
        almaId: alma_id,
        name,
        socialName: social_name,
        email: createUser.email,
        role,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return userResponse;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError(
          `user-repository.createUser`,
          400,
          `[ '${error.meta?.target}' ] already in use`,
        );
      }

      throw new AppError('user-repository.createUser', 500, 'user not created');
    }
  }

  getClients = async (professionalId: string): Promise<ProfessionalClients> => {
    try {
      const appointmentRecords = await this.prisma.appointmentRecord.findMany({
        where: {
          professional_id: professionalId,
        },
        select: {
          appointment: {
            select: {
              id: true,
              client_name: true,
              client_phone: true,
            },
          },
        },
      });

      const clients = appointmentRecords.map((record) => ({
        id: record.appointment.id,
        name: record.appointment.client_name,
        phone: record.appointment.client_phone,
      }));

      const result = {
        professionalId,
        clients,
      };

      return result;
    } catch (error) {
      throw new AppError(
        'user-repository.getClients',
        500,
        'could not get clients',
      );
    }
  };

  findById = async (userId: string): Promise<UserInfo> => {
    try {
      const userData = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!userData) {
        throw new AppError('user-repository.findById', 404, 'user not found');
      }

      const { id, alma_id, name, social_name, role, created_at, updated_at } =
        userData;

      const user = {
        id,
        almaId: alma_id,
        name,
        socialName: social_name,
        role,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError('user-repository.findById', 500, 'could not get user');
    }
  };

  getUserByJwt = async (accessToken: string): Promise<UserData> => {
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const userAlmaId = decodedToken?.sub;

      const user = await this.prisma.user.findFirst({
        where: {
          alma_id: String(userAlmaId),
        },
      });

      const getUserPath = `${process.env.GET_USER_PATH}/${user.alma_id}`;
      const userAlmaData = await this.almaRequest<AlmaUserData>(
        getUserPath,
        accessToken,
        'get',
      );

      const { socialName, bornDate, motherName } = userAlmaData.personal;
      const { username, email, phone } = userAlmaData.contact;
      const { status } = userAlmaData.security;
      const { id, alma_id, name, role, created_at, updated_at } = user;

      const userData = {
        id,
        almaId: alma_id,
        name,
        socialName,
        bornDate,
        motherName,
        username,
        email,
        phone,
        status,
        role,
        createdAt: created_at,
        updatedAt: updated_at,
      };

      return userData;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'user-repository.getUserByJwt',
        500,
        'could not get user',
      );
    }
  };

  updateUser = async (
    userId: string,
    accessToken: string,
    updateUser: UpdateUserDto,
  ): Promise<UpdatedUser> => {
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET) as {
        sub: string;
      };
      const userAlmaId = decodedToken?.sub;

      const updateUserPath = `${process.env.UPDATE_USER_PATH}/${userAlmaId}`;
      const userAlmaDataUpdated = await this.almaRequest<AlmaUserUpdated>(
        updateUserPath,
        accessToken,
        'patch',
        updateUser,
      );

      const { firstName, lastName, socialName } = updateUser;
      const { personal, contact, security } = userAlmaDataUpdated;

      if (firstName || lastName || socialName) {
        const fullName = `${personal.firstName} ${personal.lastName}`;

        await this.prisma.user.update({
          data: {
            name: fullName,
            social_name: personal.socialName,
          },
          where: {
            id: userId,
          },
        });
      }

      delete personal.id;
      delete contact.id;
      delete security.id;

      const updatedUser: UpdatedUser = {
        ...userAlmaDataUpdated,
        id: userId,
      };

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'user-repository.updateUser',
        500,
        'could not update user',
      );
    }
  };
}

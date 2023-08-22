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

  private async almaPostRequest(path: string, body: object): Promise<AlmaUser> {
    try {
      const response = await axios.post(path, body);
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  private async almaGetRequest(
    path: string,
    accessToken: string,
  ): Promise<AlmaUserData> {
    try {
      const response = await axios.get(path, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  private async almaPatchRequest(
    path: string,
    accessToken: string,
    body: object,
  ): Promise<AlmaUserUpdated> {
    try {
      const response = await axios.patch(path, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  async createUser(createUser: CreateUserDto, role: UserRole): Promise<User> {
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

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new AppError(
          `user-repository.createAdminUser`,
          400,
          `[ '${error.meta?.target}' ] already in use`,
        );
      }

      throw new AppError(
        'user-repository.createAdminUser',
        500,
        'user not created',
      );
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
      const userAlmaData = await this.almaGetRequest(getUserPath, accessToken);

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
        throw new AppError('user-repository.getUserByJwt', 503, error.message);
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
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const userAlmaId = decodedToken?.sub;

      const updateUserPath = `${process.env.UPDATE_USER_PATH}/${userAlmaId}`;
      const userAlmaDataUpdated = await this.almaPatchRequest(
        updateUserPath,
        accessToken,
        updateUser,
      );

      const { firstName, lastName, socialName } = updateUser;
      const { personal, contact, security } = userAlmaDataUpdated;

      if (firstName || lastName || socialName) {
        await this.prisma.user.update({
          data: {
            name: `${personal.firstName} ${personal.lastName}`,
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

      const updatedUser = {
        ...userAlmaDataUpdated,
        id: userId,
      };

      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError('user-repository.updateUser', 400, error.message);
      }

      throw new AppError(
        'user-repository.updateUser',
        500,
        'could not update user',
      );
    }
  };
}

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRole } from '../enum/user-role.enum';
import {
  ProfessionalClients,
  UpdatedUser,
  User,
  UserData,
} from './user.interface';

export interface IUserRepository {
  createUser(data: CreateUserDto, role: UserRole): Promise<User>;
  getClients(professionalId: string): Promise<ProfessionalClients>;
  getUser(userId: string, accessToken: string): Promise<UserData>;
  updateUser(
    userId: string,
    accessToken: string,
    data: UpdateUserDto,
  ): Promise<UpdatedUser>;
}

export interface AlmaUser {
  id: string;
  personal: {
    id: string;
    firstName: string;
    socialName: string;
  };
  contact: {
    id: string;
    username: string;
    email: string;
  };
  security: {
    id: string;
    status: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AlmaUserData extends AlmaUser {
  personal: AlmaUser['personal'] & {
    lastName: string;
    bornDate: string;
    motherName: string;
    updatedAt: Date;
  };
  contact: AlmaUser['contact'] & {
    phone: string;
    updatedAt: Date;
  };
  security: AlmaUser['security'] & {
    updatedAt: Date;
  };
}

export interface AlmaUserUpdated extends AlmaUser {
  personal: AlmaUser['personal'] & {
    lastName: string;
    updatedAt: Date;
  };
  contact: AlmaUser['contact'] & {
    updatedAt: Date;
  };
  security: AlmaUser['security'] & {
    updatedAt: Date;
  };
}

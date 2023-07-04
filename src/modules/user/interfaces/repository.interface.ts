import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { AdminUser } from './user.interface';

export interface IUserRepository {
  createAdminUser(data: CreateUserDto, role: UserRole): Promise<AdminUser>;
}

export interface PostAlmaUser {
  id: string;
  personal: {
    id: string;
    firstName: string;
    socialName: string;
  };
  contact: {
    id: 345678;
    username: string;
    email: string;
  };
  security: {
    id: string;
    status: string;
  };
  createdAt: string;
  updatedAt: string;
}

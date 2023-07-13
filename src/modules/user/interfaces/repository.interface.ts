import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { ProfessionalClients, User, UserData } from './user.interface';

export interface IUserRepository {
  createUser(data: CreateUserDto, role: UserRole): Promise<User>;
  getClients(professionalId: string): Promise<ProfessionalClients>;
  getUser(userId: string, accessToken: string): Promise<UserData>;
  updateUser(userId: string, accessToken: string, data: UpdateUserDto);
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
  createdAt: string;
  updatedAt: string;
}

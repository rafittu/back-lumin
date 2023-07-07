import { CreateUserDto } from '../dto/create-user.dto';
import { UserRole } from '../enum/user-role.enum';
import { User } from './user.interface';

export interface IUserRepository {
  createUser(data: CreateUserDto, role: UserRole): Promise<User>;
  getProfessionalClients(professionalId: string);
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

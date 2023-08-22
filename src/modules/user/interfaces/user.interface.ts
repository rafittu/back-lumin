import { UserRole } from '../enum/user-role.enum';

export interface User {
  id: string;
  almaId: string;
  name: string;
  socialName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  id: string;
  name: string;
  socialName: string;
  bornDate: string;
  motherName: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatedUser {
  id: string;
  personal: {
    firstName: string;
    lastName: string;
    socialName?: string;
    updatedAt: Date;
  };
  contact: {
    username?: string;
    email: string;
    updatedAt: Date;
  };
  security: {
    status: string;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface ProfessionalClients {
  professionalId: string;
  clients: Client[];
}

export interface UserInfo {
  id: string;
  almaId: string;
  name: string;
  socialName: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

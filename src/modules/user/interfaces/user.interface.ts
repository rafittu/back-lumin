import { UserRole } from '../enum/user-role.enum';

export interface User {
  id: string;
  almaId: string;
  name: string;
  socialName: string;
  email: string;
  role: UserRole;
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

export interface Client {
  id: string;
  name: string;
  phone: string;
}

export interface ProfessionalClients {
  professionalId: string;
  clients: Client[];
}

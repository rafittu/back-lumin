import { UserRole } from '../enum/user-role.enum';

export interface User {
  id: string;
  almaId: string;
  name: string;
  socialName: string;
  email: string;
  role: UserRole;
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

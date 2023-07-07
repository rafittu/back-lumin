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
  client: string;
  phone: string;
}

export interface ClientsByFilter {
  professional_id: string;
  clients: Client[];
}

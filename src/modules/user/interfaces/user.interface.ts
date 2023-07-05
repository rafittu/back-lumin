import { UserRole } from '../enum/user-role.enum';

export interface AdminUser {
  id: string;
  almaId: string;
  name: string;
  socialName: string;
  email: string;
  role: UserRole;
}

export interface UserFilter {}

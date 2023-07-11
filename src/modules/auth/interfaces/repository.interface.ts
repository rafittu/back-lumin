import { JwtToken, UserCredentials } from './auth.interface';

export interface IAuthRepository {
  signIn(credentials: UserCredentials): Promise<JwtToken>;
}

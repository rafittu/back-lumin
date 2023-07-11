import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import axios from 'axios';
import { IAuthRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { JwtToken, UserCredentials } from '../interfaces/auth.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaService) {}

  private async almaPostRequest(path: string, body: object) {
    try {
      const response = await axios.post(path, body);
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  private async almaGetRequest(path: string, accessToken: string) {
    try {
      const response = await axios.get(path, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  async signIn(credentials: UserCredentials): Promise<JwtToken> {
    const signInPath: string = process.env.SIGNIN_PATH;
    const getMePath: string = process.env.GET_ME_PATH;

    try {
      const { accessToken } = await this.almaPostRequest(
        signInPath,
        credentials,
      );

      const { id } = await this.almaGetRequest(getMePath, accessToken);

      const { role } = await this.prisma.user.findFirst({
        where: {
          alma_id: id,
        },
        select: {
          role: true,
        },
      });

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw new AppError('auth-repository.signIn', 500, error.message);
      }

      throw new AppError(
        'auth-repository.signIn',
        500,
        'internal server error',
      );
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import axios from 'axios';
import { IAuthRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';

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

  async signIn(credentialsDto) {
    const signInPath: string = process.env.SIGNIN_PATH;

    try {
      const accessToken = await this.almaPostRequest(
        signInPath,
        credentialsDto,
      );

      // get almaId from accessToken

      // get user role by almaId

      return accessToken;
    } catch (error) {
      console.log(error);
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

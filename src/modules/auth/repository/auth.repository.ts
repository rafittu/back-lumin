import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma.service';
import axios from 'axios';
import { IAuthRepository } from '../interfaces/repository.interface';
import { AppError } from '../../../common/errors/Error';
import { JwtToken, UserCredentials } from '../interfaces/auth.interface';
import { RedisCacheService } from '../infra/cache/redis-cache.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    private prisma: PrismaService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  private async almaPostRequest(path: string, body: object) {
    try {
      const response = await axios.post(path, body);
      return response.data;
    } catch (error) {
      const { status, code, message } = error.response.data.error;
      throw new AppError(status, code, message);
    }
  }

  async signIn(credentials: UserCredentials): Promise<JwtToken> {
    const signInPath: string = process.env.SIGNIN_PATH;

    try {
      const { accessToken } = await this.almaPostRequest(
        signInPath,
        credentials,
      );

      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      const userAlmaId = decodedToken?.sub;

      const user = await this.prisma.user.findFirst({
        where: {
          alma_id: String(userAlmaId),
        },
        select: {
          role: true,
        },
      });

      if (!user) {
        throw new AppError('auth-repository.signIn', 404, 'user not found');
      }

      const redisExpirationTime = 60 * 60 * 24 * 27;
      await this.redisCacheService.set(
        accessToken,
        user.role,
        redisExpirationTime,
      );

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'auth-repository.signIn',
        500,
        'internal server error',
      );
    }
  }
}

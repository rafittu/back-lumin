import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RedisCacheService } from '../cache/redis-cache.service';
import { AppError } from '../../../../common/errors/Error';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization.replace('Bearer ', '');

    const cachedRole = await this.redisCacheService.get(accessToken);

    if (!cachedRole || !roles.includes(cachedRole)) {
      throw new AppError(
        'auth-repository.roleGuard',
        401,
        'Insufficient privilege to access this route',
      );
    }

    return true;
  }
}

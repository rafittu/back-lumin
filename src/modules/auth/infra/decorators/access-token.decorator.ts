import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppError } from 'src/common/errors/Error';

export const AccessToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      throw new AppError(
        'auth-repository.accessTokenDecorator',
        403,
        'Invalid request headers',
      );
    }

    const accessToken = authorizationHeader.replace('Bearer ', '');
    return accessToken;
  },
);

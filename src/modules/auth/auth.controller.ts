import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { SignInService } from './services/signin.service';
import { isPublic } from '../../modules/auth/infra/decorators/is-public.decorator';
import { JwtToken, UserCredentials } from './interfaces/auth.interface';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';

@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @isPublic()
  @Post('/signin')
  signIn(@Body() credentials: UserCredentials): Promise<JwtToken> {
    return this.signInService.execute(credentials);
  }
}

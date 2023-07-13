import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { SignInService } from './services/signin.service';
import { isPublic } from 'src/modules/auth/infra/decorators/is-public.decorator';
import { JwtToken, UserCredentials } from './interfaces/auth.interface';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { AppError } from 'src/common/errors/Error';

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

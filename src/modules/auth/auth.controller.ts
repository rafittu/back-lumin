import { Controller, Post, Body } from '@nestjs/common';
import { SignInService } from './services/signin.service';
import { isPublic } from 'src/modules/auth/infra/decorators/is-public.decorator';
import { JwtToken, UserCredentials } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @isPublic()
  @Post('/signin')
  signIn(@Body() credentials: UserCredentials): Promise<JwtToken> {
    return this.signInService.execute(credentials);
  }
}

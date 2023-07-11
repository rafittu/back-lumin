import { Controller, Post, Body } from '@nestjs/common';
import { SignInService } from './services/signin.service';
import { isPublic } from 'src/common/authentication/decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @isPublic()
  @Post('/signin')
  signIn(@Body() credentialsDto) {
    return this.signInService.execute(credentialsDto);
  }
}

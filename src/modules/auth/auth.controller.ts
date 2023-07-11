import { Controller, Post, Body } from '@nestjs/common';
import { SignInService } from './services/signin.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post('/signin')
  signIn(@Body() credentialsDto) {
    return this.signInService.execute(credentialsDto);
  }
}

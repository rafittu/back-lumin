import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  create(@Body() createAuthDto) {
    return this.authService.create(createAuthDto);
  }
}

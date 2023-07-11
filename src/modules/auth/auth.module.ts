import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignInService } from './services/signin.service';
import { AuthRepository } from './repository/auth.repository';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from './infra/strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthRepository, JwtStrategy, SignInService],
})
export class AuthModule {}

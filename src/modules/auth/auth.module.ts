import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SignInService } from './services/signin.service';
import { AuthRepository } from './repository/auth.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AuthController],
  providers: [PrismaService, AuthRepository, SignInService],
})
export class AuthModule {}

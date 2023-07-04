import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './repository/user.repository';
import { CreateAdminUserService } from './services/user-admin.service';

@Module({
  controllers: [UserController],
  imports: [HttpModule],
  providers: [PrismaService, UserRepository, CreateAdminUserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './repository/user.repository';
import { CreateAdminUserService } from './services/user-admin.service';
import { CreateClientUserService } from './services/user-client.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    UserRepository,
    CreateAdminUserService,
    CreateClientUserService,
  ],
})
export class UserModule {}

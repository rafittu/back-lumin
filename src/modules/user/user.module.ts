import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UserRepository } from './repository/user.repository';
import { CreateAdminUserService } from './services/user-admin.service';
import { CreateClientUserService } from './services/user-client.service';
import { GetClientsService } from './services/get-clients.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { GetUserService } from './services/get-user.service';
import { UpdateUserService } from './services/update-user.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaService,
    RedisCacheService,
    UserRepository,
    CreateAdminUserService,
    CreateClientUserService,
    GetClientsService,
    GetUserService,
    UpdateUserService,
  ],
})
export class UserModule {}

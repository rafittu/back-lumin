import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { PrismaService } from '../../prisma.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';

@Module({
  controllers: [SchedulerController],
  providers: [PrismaService, RedisCacheService],
})
export class SchedulerModule {}

import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { PrismaService } from '../../prisma.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { CreateAppointmmentService } from './services/create-appt.service';

@Module({
  controllers: [SchedulerController],
  providers: [PrismaService, RedisCacheService, CreateAppointmmentService],
})
export class SchedulerModule {}

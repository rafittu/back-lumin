import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { PrismaService } from '../../prisma.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { CreateAppointmentService } from './services/create-appt.service';

@Module({
  controllers: [SchedulerController],
  providers: [PrismaService, RedisCacheService, CreateAppointmentService],
})
export class SchedulerModule {}

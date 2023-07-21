import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { PrismaService } from '../../prisma.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { CreateAppointmentService } from './services/create-appt.service';
import { SchedulerRepository } from './repository/scheduler.repository';
import { FindAllAppointmentService } from './services/find-all-appts.service';
import { GetAppointmentByFilterService } from './services/appt-by-filter.service';

@Module({
  controllers: [SchedulerController],
  providers: [
    PrismaService,
    RedisCacheService,
    SchedulerRepository,
    CreateAppointmentService,
    FindAllAppointmentService,
    GetAppointmentByFilterService,
  ],
})
export class SchedulerModule {}

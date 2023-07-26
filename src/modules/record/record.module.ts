import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { PrismaService } from 'src/prisma.service';
import { RecordRepository } from './repository/record.repository';
import { CreateRecordService } from './services/create-record.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { SchedulerRepository } from '../scheduler/repository/scheduler.repository';

@Module({
  controllers: [RecordController],
  providers: [
    PrismaService,
    RedisCacheService,
    SchedulerRepository,
    RecordRepository,
    CreateRecordService,
  ],
})
export class RecordModule {}

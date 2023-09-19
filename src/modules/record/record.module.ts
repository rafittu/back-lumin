import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { PrismaService } from 'src/prisma.service';
import { RecordRepository } from './repository/record.repository';
import { CreateRecordService } from './services/create-record.service';
import { RedisCacheService } from '../auth/infra/cache/redis-cache.service';
import { SchedulerRepository } from '../scheduler/repository/scheduler.repository';
import { GetAllRecordsService } from './services/all-records.service';
import { GetOneRecordService } from './services/get-one-record.service';
import { UpdateRecordService } from './services/update-record.service';
import { ReencryptRecordsService } from './services/reencrypt-record.service';
import { GetRecordByFilterService } from './services/record-by-filter.service';

@Module({
  controllers: [RecordController],
  providers: [
    PrismaService,
    RedisCacheService,
    SchedulerRepository,
    RecordRepository,
    CreateRecordService,
    GetAllRecordsService,
    GetOneRecordService,
    UpdateRecordService,
    ReencryptRecordsService,
    GetRecordByFilterService,
  ],
})
export class RecordModule {}

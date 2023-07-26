import { Module } from '@nestjs/common';
import { RecordController } from './record.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [RecordController],
  providers: [PrismaService],
})
export class RecordModule {}

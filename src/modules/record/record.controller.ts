import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Controller('record')
export class RecordController {
  @Post()
  create(@Body() createRecordDto: CreateRecordDto) {
    return 'record created';
  }

  @Get()
  findAll() {
    return 'records';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'record';
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordDto: UpdateRecordDto) {
    return 'record updated';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'record deleted';
  }
}

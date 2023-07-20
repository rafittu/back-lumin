import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { CreateSchedulerDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('schedules')
export class SchedulerController {
  @Post()
  create(@Body() createSchedulerDto: CreateSchedulerDto) {
    return 'schedule created';
  }

  @Get()
  findAll() {
    return 'all appointments';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return 'appointment';
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSchedulerDto: UpdateSchedulerDto,
  ) {
    return 'appointment';
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'appointment cancelled';
  }
}

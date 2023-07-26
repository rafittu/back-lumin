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
  Query,
} from '@nestjs/common';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from 'src/common/filter/http-exception.filter';
import { AppError } from 'src/common/errors/Error';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateRecordService } from './services/create-record.service';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('record')
export class RecordController {
  constructor(private readonly createRecordService: CreateRecordService) {}

  @Post('/create')
  @Roles(UserRole.ADMIN)
  async create(
    @Query('professionalId') professionalId: string,
    @Query('scheduleId') scheduleId: string,
    @Body() record: CreateRecordDto,
  ) {
    return await this.createRecordService.execute(
      professionalId,
      scheduleId,
      record,
    );
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

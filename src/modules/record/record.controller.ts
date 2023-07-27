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
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CreateRecordService } from './services/create-record.service';
import { NewRecord } from './interfaces/record.interface';
import { GetAllRecordsService } from './services/all-records.service';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('record')
export class RecordController {
  constructor(
    private readonly createRecordService: CreateRecordService,
    private readonly getAllRecordsService: GetAllRecordsService,
  ) {}

  @Post('/create')
  @Roles(UserRole.ADMIN)
  async create(
    @Query('professionalId') professionalId: string,
    @Query('appointmentId') appointmentId: string,
    @Body() record: CreateRecordDto,
  ): Promise<NewRecord> {
    return await this.createRecordService.execute(
      professionalId,
      appointmentId,
      record,
    );
  }

  @Get('/all')
  @Roles(UserRole.ADMIN)
  async findAll(
    @Query('professionalId') professionalId: string,
  ): Promise<NewRecord[]> {
    return await this.getAllRecordsService.execute(professionalId);
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

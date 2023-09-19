import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
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
import {
  AllProfessionalRecords,
  NewRecord,
  ProfessionalRecord,
  UpdatedRecord,
  RecordFilters,
} from './interfaces/record.interface';
import { GetAllRecordsService } from './services/all-records.service';
import { GetOneRecordService } from './services/get-one-record.service';
import { UpdateRecordService } from './services/update-record.service';
import { ReencryptRecordsService } from './services/reencrypt-record.service';
import { GetRecordByFilterService } from './services/record-by-filter.service';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('record')
export class RecordController {
  constructor(
    private readonly createRecordService: CreateRecordService,
    private readonly getAllRecordsService: GetAllRecordsService,
    private readonly getOneRecordRecordService: GetOneRecordService,
    private readonly updateRecordService: UpdateRecordService,
    private readonly reencryptRecordsService: ReencryptRecordsService,
    private readonly getRecordByFilterService: GetRecordByFilterService,
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
  ): Promise<AllProfessionalRecords> {
    return await this.getAllRecordsService.execute(professionalId);
  }

  @Get('/filter/:id')
  @Roles(UserRole.ADMIN)
  async findByFilter(
    @Param('id') professionalId: string,
    @Query() filter: RecordFilters,
  ): Promise<ProfessionalRecord> {
    return await this.getRecordByFilterService.execute(professionalId, filter);
  }

  @Get('/:id')
  @Roles(UserRole.ADMIN)
  async findOne(
    @Param('id') recordId: string,
    @Query('professionalId') professionalId: string,
  ): Promise<ProfessionalRecord> {
    return await this.getOneRecordRecordService.execute(
      recordId,
      professionalId,
    );
  }

  @Patch('/update/:id')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') recordId: string,
    @Body() updateRecordDto: UpdateRecordDto,
  ): Promise<UpdatedRecord> {
    return await this.updateRecordService.execute(recordId, updateRecordDto);
  }

  @Patch('/config/reencrypt-records')
  async reencryptRecords(): Promise<string> {
    return await this.reencryptRecordsService.execute();
  }
}

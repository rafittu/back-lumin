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
import { CreateAppointmmentDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAppointmmentService } from './services/create-appt.service';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('schedules')
export class SchedulerController {
  constructor(
    private readonly createAppointmmentService: CreateAppointmmentService,
  ) {}

  @Post('/create')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createAppointmmentDto: CreateAppointmmentDto,
    @Query() pofessionalId: string,
  ) {
    const newAppointmment = {
      pofessionalId,
      createAppointmmentDto,
    };

    return await this.createAppointmmentService.execute(newAppointmment);
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

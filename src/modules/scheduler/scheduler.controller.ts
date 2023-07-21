import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-scheduler.dto';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAppointmentService } from './services/create-appt.service';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { NewAppointment } from './interfaces/appointment.interface';
import { FindAllAppointmentService } from './services/find-all-appts.service';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('schedules')
export class SchedulerController {
  constructor(
    private readonly createApptService: CreateAppointmentService,
    private readonly findAllApptsService: FindAllAppointmentService,
  ) {}

  @Post('/create')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Query('professionalId') professionalId: string,
  ): Promise<NewAppointment> {
    return await this.createApptService.execute(
      professionalId,
      createAppointmentDto,
    );
  }

  @Get('/professional/:id')
  @Roles(UserRole.ADMIN)
  async findAllAppointments(@Param('id') professionalId: string) {
    return await this.findAllApptsService.execute(professionalId);
  }
}

import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Query,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-scheduler.dto';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAppointmentService } from './services/create-appt.service';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import {
  Appointment,
  AppointmentFilters,
  DeletedAppointment,
  NewAppointment,
  ProfessionalAppointments,
} from './interfaces/scheduler.interface';
import { FindAllAppointmentService } from './services/find-all-appts.service';
import { GetAppointmentByFilterService } from './services/appt-by-filter.service';
import { UpdateAppointmentDto } from './dto/update-schedule.dto';
import { UpdateAppointmentService } from './services/update-appt.service';
import { DeleteAppointmentService } from './services/delete-appt.service';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('schedules')
export class SchedulerController {
  constructor(
    private readonly createApptService: CreateAppointmentService,
    private readonly findAllApptsService: FindAllAppointmentService,
    private readonly getApptByFilterService: GetAppointmentByFilterService,
    private readonly updateApptService: UpdateAppointmentService,
    private readonly deleteApptService: DeleteAppointmentService,
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
  async findAllAppointments(
    @Param('id') professionalId: string,
  ): Promise<ProfessionalAppointments> {
    return await this.findAllApptsService.execute(professionalId);
  }

  @Get('/professional/filter/:id')
  @Roles(UserRole.ADMIN)
  async findAppointmentByFilter(
    @Param('id') professionalId: string,
    @Query() filter: AppointmentFilters,
  ): Promise<ProfessionalAppointments> {
    return await this.getApptByFilterService.execute(professionalId, filter);
  }

  @Patch('/update/:appointmentId')
  @Roles(UserRole.ADMIN)
  async update(
    @Param('appointmentId') appointmentId: string,
    @Query('professionalId') professionalId: string,
    @Body() updateAppointment: UpdateAppointmentDto,
  ): Promise<Appointment> {
    return await this.updateApptService.execute(
      appointmentId,
      professionalId,
      updateAppointment,
    );
  }

  @Delete('/delete/:appointmentId')
  @Roles(UserRole.ADMIN)
  async delete(
    @Param('appointmentId') appointmentId: string,
  ): Promise<DeletedAppointment> {
    return await this.deleteApptService.execute(appointmentId);
  }
}

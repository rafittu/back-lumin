import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-scheduler.dto';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAppointmentService } from './services/create-appt.service';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { NewAppointment } from './interfaces/appointment.interface';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('schedules')
export class SchedulerController {
  constructor(
    private readonly createAppointmmentService: CreateAppointmentService,
  ) {}

  @Post('/create')
  @Roles(UserRole.ADMIN)
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Query('professionalId') professionalId: string,
  ): Promise<NewAppointment> {
    return await this.createAppointmmentService.execute(
      professionalId,
      createAppointmentDto,
    );
  }
}

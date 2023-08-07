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
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateManyPaymentsService } from './services/create-many-pmts.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentService } from './services/create-payment.service';
import { GetOnePaymentService } from './services/get-one-payment.service';
import { FindPaymentByFilterService } from './services/find-by-filter.service';
import { UpdatePaymentService } from './services/update-payment.service';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from '../user/enum/user-role.enum';
import { PaymentResponse } from './interfaces/payment.interface';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('payment')
export class PaymentsController {
  constructor(
    private readonly createPaymentService: CreatePaymentService,
    private readonly createManyPaymentsService: CreateManyPaymentsService,
    private readonly findByFilterService: FindPaymentByFilterService,
    private readonly findOneService: GetOnePaymentService,
    private readonly updatePaymentService: UpdatePaymentService,
  ) {}

  @Post('/create')
  @Roles(UserRole.ADMIN)
  create(
    @Query('professionalId') professionalId: string,
    @Query('appointmentId') appointmentId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    return this.createPaymentService.execute(
      professionalId,
      appointmentId,
      createPaymentDto,
    );
  }

  @Post('/create-many')
  @Roles(UserRole.ADMIN)
  createMany(
    @Query('professionalId') professionalId: string,
    @Query('appointmentsIds') appointmentsIds: string[],
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.createManyPaymentsService.execute(
      professionalId,
      appointmentsIds,
      createPaymentDto,
    );
  }

  @Get()
  findByFilter(filter) {
    return this.findByFilterService.execute(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneService.execute(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.updatePaymentService.execute(id, updatePaymentDto);
  }
}

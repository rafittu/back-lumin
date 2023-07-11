import {
  Controller,
  Post,
  Body,
  UseFilters,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfessionalClients, User } from './interfaces/user.interface';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAdminUserService } from './services/user-admin.service';
import { CreateClientUserService } from './services/user-client.service';
import { GetClientsService } from './services/get-clients.service';
import { isPublic } from 'src/modules/auth/infra/decorators/is-public.decorator';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from './enum/user-role.enum';
import { RolesGuard } from '../auth/infra/guards/role.guard';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('user')
export class UserController {
  constructor(
    private readonly adminUserService: CreateAdminUserService,
    private readonly clientUserService: CreateClientUserService,
    private readonly getClientsService: GetClientsService,
  ) {}

  @isPublic()
  @Post('/admin')
  createAdminUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.adminUserService.execute(createUserDto);
  }

  @isPublic()
  @Post('/client')
  createClientUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.clientUserService.execute(createUserDto);
  }

  @Get('/professional/:id')
  @Roles(UserRole.ADMIN)
  findAllProfessionalClients(
    @Param('id') professionalId: string,
  ): Promise<ProfessionalClients> {
    return this.getClientsService.execute(professionalId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch('/update/:id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete('/delete/:id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}

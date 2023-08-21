import {
  Controller,
  Post,
  Body,
  UseFilters,
  Get,
  Param,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ProfessionalClients,
  UpdatedUser,
  UserData,
} from './interfaces/user.interface';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAdminUserService } from './services/user-admin.service';
import { CreateClientUserService } from './services/user-client.service';
import { GetClientsService } from './services/get-clients.service';
import { isPublic } from '../../modules/auth/infra/decorators/is-public.decorator';
import { Roles } from '../auth/infra/decorators/role.decorator';
import { UserRole } from './enum/user-role.enum';
import { RolesGuard } from '../auth/infra/guards/role.guard';
import { GetUserService } from './services/get-user.service';
import { AccessToken } from '../auth/infra/decorators/access-token.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserService } from './services/update-user.service';
import { JwtToken } from '../auth/interfaces/auth.interface';

@UseGuards(RolesGuard)
@UseFilters(new HttpExceptionFilter(new AppError()))
@Controller('users')
export class UserController {
  constructor(
    private readonly adminUserService: CreateAdminUserService,
    private readonly clientUserService: CreateClientUserService,
    private readonly getClientsService: GetClientsService,
    private readonly getUserService: GetUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @isPublic()
  @Post('/admin')
  createAdminUser(@Body() createUserDto: CreateUserDto): Promise<JwtToken> {
    return this.adminUserService.execute(createUserDto);
  }

  @isPublic()
  @Post('/client')
  createClientUser(@Body() createUserDto: CreateUserDto): Promise<JwtToken> {
    return this.clientUserService.execute(createUserDto);
  }

  @Get('/professional/:id')
  @Roles(UserRole.ADMIN)
  findAllProfessionalClients(
    @Param('id') professionalId: string,
  ): Promise<ProfessionalClients> {
    return this.getClientsService.execute(professionalId);
  }

  @Get('/user/:id')
  findUser(
    @Param('id') userId: string,
    @AccessToken() accessToken: string,
  ): Promise<UserData> {
    return this.getUserService.execute(userId, accessToken);
  }

  @Patch('/update/:id')
  update(
    @Param('id') userId: string,
    @AccessToken() accessToken: string,
    @Body() dataToUpdate: UpdateUserDto,
  ): Promise<UpdatedUser> {
    return this.updateUserService.execute(userId, accessToken, dataToUpdate);
  }
}

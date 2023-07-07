import { Controller, Post, Body, UseFilters, Get, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAdminUserService } from './services/user-admin.service';
import { CreateClientUserService } from './services/user-client.service';
import { GetClientsService } from './services/get-clients.service';
import { ClientFilter } from './enum/client-filter.enum';

@Controller('user')
@UseFilters(new HttpExceptionFilter(new AppError()))
export class UserController {
  constructor(
    private readonly adminUserService: CreateAdminUserService,
    private readonly clientUserService: CreateClientUserService,
    private readonly getClientsService: GetClientsService,
  ) {}

  @Post('/admin')
  createAdminUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.adminUserService.execute(createUserDto);
  }

  @Post('/client')
  createClientUser(@Body() createUserDto: CreateUserDto) {
    return this.clientUserService.execute(createUserDto);
  }

  @Get('/professional/:id')
  findAllByFilter(@Query('filter') filter: ClientFilter) {
    return this.getClientsService.execute(filter);
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

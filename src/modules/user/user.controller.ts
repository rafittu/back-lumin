import { Controller, Post, Body, UseFilters } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { HttpExceptionFilter } from '../../common/filter/http-exception.filter';
import { AppError } from '../../common/errors/Error';
import { CreateAdminUserService } from './services/user-admin.service';
import { CreateClientUserService } from './services/user-client.service';

@Controller('user')
@UseFilters(new HttpExceptionFilter(new AppError()))
export class UserController {
  constructor(
    private readonly adminUserService: CreateAdminUserService,
    private readonly clientUserService: CreateClientUserService,
  ) {}

  @Post('/admin')
  createAdminUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.adminUserService.execute(createUserDto);
  }

  @Post('/client')
  createClientUser(@Body() createUserDto: CreateUserDto) {
    return this.clientUserService.execute(createUserDto);
  }

  // @Get()
  // findAllByFilter(@Query('filter') filter: UserFilter) {
  //   return this.userService.findAll();
  // }

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

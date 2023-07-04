import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  firstName: string;

  lastName: string;

  socialName: string;

  bornDate: string;

  motherName: string;

  username: string;

  email: string;

  phone: string;

  password: string;

  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['lumin'])
  origin: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAppointmmentDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsString()
  clientPhone: string;

  @IsNotEmpty()
  @IsString()
  scheduledAt: Date;
}

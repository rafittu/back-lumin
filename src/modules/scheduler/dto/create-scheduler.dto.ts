import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsString()
  clientPhone: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10, { message: 'must be a valid date: yyyy-mm-dd' })
  @Matches(
    /^([0-9]{4}-((0[13578]|1[02])-([0-2][1-9]|3[0-1])|(0[469]|11)-(0[1-9]|[1-2][0-9]|30)|02-(0[1-9]|[1-2][0-9]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)-02-29)$/,
    {
      message: 'must be a valid date and formatted as yyyy-mm-dd',
    },
  )
  appointmentDate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'must be a valid time (HH:mm) and formatted as 24-hours',
  })
  appointmentTime: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecordDto {
  @IsNotEmpty()
  @IsString()
  record: string;
}

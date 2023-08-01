import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDto } from './create-record.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateRecordDto extends PartialType(CreateRecordDto) {
  @IsNotEmpty()
  @IsString()
  record: string;
}

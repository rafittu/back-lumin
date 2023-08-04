import {
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaymentStatus } from '../enum/payment-status.enum';
import { PaymentMethod } from '../enum/payment-method.enum';
import { Decimal } from '@prisma/client/runtime';

export class CreatePaymentDto {
  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'must be a valid date: yyyy-mm-dd' })
  paymentDate?: string;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  @IsDecimal()
  totalPaid?: Decimal;
}

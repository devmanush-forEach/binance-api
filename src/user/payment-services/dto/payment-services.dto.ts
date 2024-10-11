import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
import { PaymentServices } from '../payment-services.schema';
import { Currency } from 'src/currency/currency.schema';

export class CreatePaymentServicesDto {
  @IsString()
  @IsNotEmpty()
  holderName: string;

  @IsEnum(['BANK', 'UPI'])
  @IsNotEmpty()
  paymentType: string;

  // Bank-specific fields
  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  ifsccode?: string;

  @IsString()
  @IsOptional()
  accountNumber?: string;

  // UPI-specific field
  @IsString()
  @IsOptional()
  upiId?: string;

  @IsString()
  @IsOptional()
  remark?: string;

  @IsNotEmpty()
  transactionMethodId: Types.ObjectId;

  @IsNotEmpty()
  userId: Types.ObjectId;
}

export class UpdatePaymentServicesDto extends PartialType(
  CreatePaymentServicesDto,
) {}

export interface TransactionMethod {
  _id: string;
  name: string;
  type: string;
  color: string;
  supportedCurrencies: string[] | Currency[];
}

export interface UserPaymentServiceResponse {
  paymentMethod: TransactionMethod;
  paymentServices: PaymentServices[];
}

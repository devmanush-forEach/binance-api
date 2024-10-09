import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class DepositDto {
  @IsString()
  @IsNotEmpty()
  coinId: string;

  @IsString()
  @IsNotEmpty()
  networkId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  depositAddress: string;
}

export class WithdrawalDto {
  @IsString()
  @IsNotEmpty()
  coinId: string;

  @IsString()
  @IsNotEmpty()
  networkId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  withdrawAddress: string;
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
}

export class SearchTransactionsDto {
  @IsOptional()
  @IsString()
  user?: string;

  @IsOptional()
  @IsString()
  coin?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  transactionType?: TransactionType;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  network?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  withdrawAddress?: string;

  @IsOptional()
  @IsString()
  depositAddress?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

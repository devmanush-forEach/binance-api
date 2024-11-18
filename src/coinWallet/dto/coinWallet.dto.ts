import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsNumber,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCoinWalletDto {
  @IsMongoId()
  @IsNotEmpty()
  coinId: string;

  @IsMongoId()
  @IsNotEmpty()
  networkId: string;

  @IsNumber()
  @IsNotEmpty()
  minDeposit: number;

  @IsNumber()
  @IsNotEmpty()
  minWithdrawal: number;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}

export class UpdateCoinWalletDto extends PartialType(CreateCoinWalletDto) {}

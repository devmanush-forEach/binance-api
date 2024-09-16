import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdType } from '../advertisement.schema';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAdvertisementDto {
  @IsEnum(AdType)
  adType: AdType;

  @IsString()
  @IsNotEmpty()
  priceType: string;

  @IsNumber()
  transactionPrice: number;

  @IsNumber()
  marketPrice: number;

  @IsNumber()
  minAmount: number;

  @IsNumber()
  maxAmount: number;

  @IsString()
  @IsNotEmpty()
  transactionTitle: string;

  @IsString()
  @IsOptional()
  transactionRemark?: string;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @IsNumber()
  transactionFee: number;
}

export class UpdateAdvertisementDto extends PartialType(
  CreateAdvertisementDto,
) {}

import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AdType } from '../advertisement.schema';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateAdvertisementDto {
  @IsEnum(AdType)
  adType: AdType;

  @IsString()
  @IsNotEmpty()
  priceType: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

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
) { }


export class GetAdvertisementsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  adType?: string;

  @IsOptional()
  @IsString()
  coinId?: string;

  @IsOptional()
  @IsNumberString()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsNumberString()
  @Type(() => Number)
  @Min(1)
  limit?: number = 10;
}
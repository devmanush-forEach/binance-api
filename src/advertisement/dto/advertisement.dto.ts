import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AdType } from '../advertisement.schema';
import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CounterPartyConditionsDto {
  @IsNumber()
  @IsOptional()
  registeredDaysAgo?: number;

  @IsNumber()
  @IsOptional()
  holdingsMoreThan?: number;
}

export class CreateAdvertisementDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsEnum(AdType)
  @IsNotEmpty()
  adType: AdType;

  @IsBoolean()
  @IsNotEmpty()
  isOnline: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isDynamicPrice: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isFixedPrice: boolean;

  @IsNumber()
  @IsOptional()
  transactionPrice?: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsOptional()
  pricePercent?: number;

  @IsNumber()
  @IsNotEmpty()
  transactionLimitMin: number;

  @IsNumber()
  @IsNotEmpty()
  transactionLimitMax: number;

  @IsNumber()
  @IsNotEmpty()
  transactionTimeLimit: number;

  @IsMongoId()
  @IsNotEmpty()
  currency: Types.ObjectId;

  @IsString()
  @IsOptional()
  transactionTitle?: string;

  @IsString()
  @IsOptional()
  transactionRemark?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  transactionMethods?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  paymentMethods?: Types.ObjectId[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  regions?: Types.ObjectId[];

  @IsMongoId()
  @IsNotEmpty()
  coinId: Types.ObjectId;

  @ValidateNested()
  @Type(() => CounterPartyConditionsDto)
  @IsOptional()
  counterPartyConditions?: CounterPartyConditionsDto;
}

export class UpdateAdvertisementDto extends PartialType(
  CreateAdvertisementDto,
) {}

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
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Min(10)
  limit?: number = 10;
}

export class SearchAdvertisementsDto {
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
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Min(10)
  limit?: number = 10;
}

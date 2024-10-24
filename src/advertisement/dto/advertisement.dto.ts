import {
  IsArray,
  IsBoolean,
  IsDate,
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

  @IsString()
  @IsOptional()
  autoReplyMessage?: string;

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

  @IsBoolean()
  @IsNotEmpty()
  allRegions: boolean;

  @IsMongoId()
  @IsNotEmpty()
  coinId: Types.ObjectId;

  @ValidateNested()
  @Type(() => CounterPartyConditionsDto)
  @IsOptional()
  counterPartyConditions?: CounterPartyConditionsDto;
}
export class UpdateAdvertisementDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsBoolean()
  @IsNotEmpty()
  isOnline: boolean;

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

  @IsString()
  @IsOptional()
  transactionTitle?: string;

  @IsString()
  @IsOptional()
  transactionRemark?: string;

  @IsString()
  @IsOptional()
  autoReplyMessage?: string;

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

  @IsBoolean()
  @IsNotEmpty()
  allRegions: boolean;

  @ValidateNested()
  @Type(() => CounterPartyConditionsDto)
  @IsOptional()
  counterPartyConditions?: CounterPartyConditionsDto;
}

export class DateRange {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fromDate?: Date | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  toDate?: Date | null;
}

export class GetAdvertisementsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  status?: 'online' | 'offline';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRange)
  dateRange?: DateRange;

  @IsOptional()
  @IsString()
  sortBy?: string;
}

export class SearchAdvertisementsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  adType?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  paymentMethods?: string[];

  @IsOptional()
  @IsString()
  coinId?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsNumber()
  priceRange?: number;

  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Min(10)
  limit?: number = 10;

  @IsOptional()
  @ValidateNested()
  @Type(() => DateRange)
  dateRange?: DateRange;

  @IsOptional()
  @IsString()
  sortBy?: string;
}

import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCountryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsString()
  @IsNotEmpty()
  phoneCode: string;

  @IsString()
  @IsNotEmpty()
  isoCode: string;

  @IsNotEmpty()
  currency: Types.ObjectId;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCountryDto extends PartialType(CreateCountryDto) {}

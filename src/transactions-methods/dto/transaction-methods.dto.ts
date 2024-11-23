import {
  IsString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransactionMethodsDto {
  @IsString()
  name: string;

  @IsEnum(['BANK', 'UPI'])
  type: 'BANK' | 'UPI';

  @IsString()
  color: string;

  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String) // Ensure proper transformation of ObjectIds
  supportedCurrencies: string[];

  @IsBoolean()
  @IsOptional()
  isUniversal: boolean = false;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;
}

export class UpdateTransactionMethodsDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(['BANK', 'UPI'])
  @IsOptional()
  type?: 'BANK' | 'UPI';

  @IsString()
  @IsOptional()
  color?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  @IsOptional()
  supportedCurrencies?: string[];

  @IsBoolean()
  @IsOptional()
  isUniversal?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

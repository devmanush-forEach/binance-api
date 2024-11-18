import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsIn,
  IsInt,
  Min,
  IsUrl,
  ValidateNested,
  IsOptional,
} from 'class-validator';

export class Deposit {
  @IsInt()
  @Min(1)
  transferSpeed: number;

  @IsInt()
  @Min(1)
  confirmationSpeed: number;
}

export class Withdraw {
  @IsInt()
  @Min(1)
  speeds: number;
}

export class CreateNetworkDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsOptional()
  @IsString()
  networkProtocol: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  confirmationsRequired: number;

  @IsInt()
  @Min(1)
  blockConfirmations: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  averageConfirmationTime: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => Deposit)
  deposit: Deposit;

  @IsOptional()
  @ValidateNested()
  @Type(() => Withdraw)
  withdraw: Withdraw;
}

export class UpdateNetworkDto extends PartialType(CreateNetworkDto) {}

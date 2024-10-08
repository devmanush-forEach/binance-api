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

  @IsString()
  @IsIn(['ERC20', 'TRC20', 'BEP20', 'Others'])
  networkProtocol: string;

  @IsInt()
  @Min(1)
  confirmationsRequired: number;

  @IsUrl()
  icon: string;

  @IsInt()
  @Min(1)
  averageConfirmationTime: number;

  @ValidateNested()
  @Type(() => Deposit)
  deposit: Deposit;

  @ValidateNested()
  @Type(() => Withdraw)
  withdraw: Withdraw;
}

export class UpdateNetworkDto extends PartialType(CreateNetworkDto) {}

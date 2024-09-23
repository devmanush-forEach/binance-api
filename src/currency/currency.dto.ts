import { PartialType } from '@nestjs/mapped-types';
export class CreateCurrencyDto {
  name: string;
  code: string;
  symbol: string;
  valueInUSD: number;
}

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {}

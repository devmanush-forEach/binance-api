import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DepositDto {
  @IsString()
  @IsNotEmpty()
  coinId: string; // Coin symbol like 'BTC', 'ETH'

  @IsString()
  @IsNotEmpty()
  networkId: string; // Network like 'ERC20', 'TRC20'

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class WithdrawalDto {
  @IsString()
  @IsNotEmpty()
  coinId: string;

  @IsString()
  @IsNotEmpty()
  networkId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  address: string; // Withdrawal address
}

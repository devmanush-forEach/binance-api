import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Wallet } from './wallet.schema';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  async getWallet(@Param('userId') userId: string): Promise<Wallet> {
    return this.walletService.findWalletByUserId(userId);
  }

  @Post(':userId/add-crypto')
  async addCrypto(
    @Param('userId') userId: string,
    @Body('coinId') coinId: string,
    @Body('value') value: number,
    @Body('address') address: string,
  ): Promise<Wallet> {
    return this.walletService.addCryptocurrencyToWallet(
      userId,
      coinId,
      value,
      address,
    );
  }
}

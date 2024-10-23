import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('create/:userId')
  async createWallet(@Param('userId') userId: string) {
    return this.walletService.createWallet(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWallet(@Param('userId') userId: string) {
    return this.walletService.getWalletByUserId(userId);
  }

  @Post('add/:userId')
  async addCrypto(
    @Param('userId') userId: string,
    @Body() crypto: string,
    @Body() amount: number,
  ) {
    return this.walletService.addCryptoToUserWallet(userId, crypto, amount);
  }

  @Post('remove/:userId/:coinId')
  async removeCrypto(
    @Param('userId') userId: string,
    @Body('coinId') coinId: string,
    @Body('amount') amount: number,
  ) {
    return this.walletService.removeCryptoFromWallet(userId, coinId, amount);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Types } from 'mongoose';
import { WalletValue } from './crypto/crypto.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post('create/:userId')
  async createWallet(@Param('userId') userId: string) {
    const id = new Types.ObjectId(userId);
    return this.walletService.createWallet(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWallet(@Param('userId') userId: string) {
    const id = new Types.ObjectId(userId);
    return this.walletService.getWalletByUserId(id);
  }

  @Post('add/:userId')
  async addCrypto(
    @Param('userId') userId: string,
    @Body() crypto: WalletValue,
  ) {
    const id = new Types.ObjectId(userId);
    return this.walletService.addCryptoToWallet(id, crypto);
  }

  @Post('remove/:userId/:coinId')
  async removeCrypto(
    @Param('userId') userId: string,
    @Param('coinId') coinId: string,
  ) {
    const userIdObj = new Types.ObjectId(userId);
    const coinIdObj = new Types.ObjectId(coinId);
    return this.walletService.removeCryptoFromWallet(userIdObj, coinIdObj);
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { Coin } from 'src/coin/coin.schema';
import { Crypto } from './crypto/crypto.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Coin.name) private coinModel: Model<Coin>,
  ) {}

  async findWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletModel
      .findOne({ userId })
      .populate('cryptocurrencies.coin')
      .exec();
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async addCryptocurrencyToWallet(
    userId: string,
    coinId: string,
    balance: number,
    address: string,
  ): Promise<Wallet> {
    let wallet = await this.walletModel.findOne({ userId }).exec();
    const coin = await this.coinModel.findById(coinId).exec();

    if (!coin) {
      throw new NotFoundException('Coin not found');
    }

    const cryptoData: Crypto = {
      coin: coin._id,
      balance,
      address,
    };

    if (!wallet) {
      // Create a new wallet if it doesn't exist
      wallet = new this.walletModel({
        userId,
        cryptocurrencies: [cryptoData],
      });
    } else {
      // Add the cryptocurrency to the existing wallet
      wallet.cryptocurrencies.push(cryptoData);
    }

    return await wallet.save();
  }
}

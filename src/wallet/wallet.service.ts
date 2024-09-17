import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { WalletValue } from './crypto/crypto.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) { }

  async createWallet(userId: Types.ObjectId): Promise<Wallet> {
    const wallet = new this.walletModel({ userId, cryptocurrencies: [] });
    return wallet.save();
  }

  async getWalletByUserId(userId: Types.ObjectId): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ userId }).populate('userId');
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async addCryptoToWallet(userId: Types.ObjectId, crypto: WalletValue): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ userId }).populate('userId');
    if (!wallet) throw new NotFoundException('Wallet not found');
    wallet.walletValues.push(crypto);
    return await wallet.save();
  }

  async removeCryptoFromWallet(userId: Types.ObjectId, coinId: Types.ObjectId): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ userId }).populate('userId');
    if (!wallet) throw new NotFoundException('Wallet not found');
    wallet.walletValues = wallet.walletValues.filter(
      (crypto) => crypto.coin.toString() !== coinId.toString(),
    );
    return await wallet.save();
  }
}

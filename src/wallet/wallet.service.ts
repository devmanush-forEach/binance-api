import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { WalletValue } from './crypto/crypto.schema';
import { TransactionDocument } from 'src/transaction/transaction.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Wallet.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async createWallet(userId: string): Promise<Wallet> {
    const wallet = new this.walletModel({ userId, walletValues: [] });
    return wallet.save();
  }

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletModel
      .findOne({ userId })
      .select({ userId: 0 })
      .lean()
      .populate({
        path: 'walletValues.coin',
        model: 'Coin',
      })
      .exec();

    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }
  async getCoinBalanceByUserId(
    userId: string,
    coinId: string,
  ): Promise<WalletValue> {
    const wallet = await this.walletModel
      .findOne({ userId })
      .select({ userId: 0 })
      .lean()
      .exec();

    if (!wallet) throw new NotFoundException('Wallet not found');

    const walletValueWithCoin = wallet?.walletValues?.find(
      (value) => value.coin.toString() === coinId,
    );

    return walletValueWithCoin;
  }

  async addCryptoToWallet(
    userId: Types.ObjectId,
    crypto: WalletValue,
  ): Promise<Wallet> {
    const wallet = await this.walletModel
      .findOne({ userId })
      .populate('userId');
    if (!wallet) throw new NotFoundException('Wallet not found');
    wallet.walletValues.push(crypto);
    return await wallet.save();
  }

  async removeCryptoFromWallet(
    userId: Types.ObjectId,
    coinId: Types.ObjectId,
  ): Promise<Wallet> {
    const wallet = await this.walletModel
      .findOne({ userId })
      .populate('userId');
    if (!wallet) throw new NotFoundException('Wallet not found');
    wallet.walletValues = wallet.walletValues.filter(
      (crypto) => crypto.coin.toString() !== coinId.toString(),
    );
    return await wallet.save();
  }
}

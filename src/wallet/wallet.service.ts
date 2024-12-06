import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Wallet, WalletDocument } from './wallet.schema';
import { WalletValue } from './crypto/crypto.schema';
import { TransactionDocument } from 'src/transaction/transaction.schema';
import { CoinWalletService } from 'src/coinWallet/coinWallet.service';
import {
  CoinWallet,
  CoinWalletDocument,
} from 'src/coinWallet/coinWallet.schema';

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
      .populate([
        {
          path: 'walletValues.coin',
          model: 'Coin',
          populate: {
            path: 'currency',
            model: 'Currency',
          },
        },
      ])
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

    const walletValueWithCoin = wallet?.walletValues?.find(
      (value) => value.coin.toString() === coinId,
    );

    return walletValueWithCoin;
  }

  async getWalletBalanceInUsd(userId: string): Promise<number> {
    try {
      const wallet = await this.walletModel
        .findOne({ userId })
        .populate({
          path: 'walletValues.coin',
          populate: {
            path: 'currency',
          },
        })
        .lean()
        .exec();

      const walletValue = wallet?.walletValues.reduce((total, item: any) => {
        const balance = +item.balance;
        const priceUSD = +item.coin.price;
        const valueInUSD = +item.coin.currency.valueInUSD;
        const value = balance * priceUSD * valueInUSD;
        return total + value;
      }, 0);
      return walletValue;
    } catch (error) {
      return 0;
    }
  }

  async addCryptoToUserWallet(
    userId: string,
    coinId: string,
    amount: number,
    coinWallet?: string,
  ): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({
      userId,
    });
    const cObjectIdId = new Types.ObjectId(coinId);
    let cWalletObjectId: Types.ObjectId;
    if (coinWallet) {
      cWalletObjectId = new Types.ObjectId(coinWallet);
    }

    if (!wallet) {
      const newWallet = new this.walletModel({
        userId,
        walletValues: [],
      });
      const walletValues = newWallet.walletValues || [];
      walletValues.push({
        coin: cObjectIdId,
        balance: amount,
      });
      newWallet.walletValues = walletValues;
      return newWallet.save();
    } else {
      let walletValues: WalletValue[] = wallet.walletValues;

      const coinWallet = walletValues.find(
        (walletValue) => walletValue.coin.toString() === coinId,
      );
      if (coinWallet) {
        walletValues = walletValues.map((walletValue: WalletValue) => {
          if (walletValue.coin.toString() === coinId) {
            return {
              ...walletValue,
              balance: walletValue.balance + amount,
            };
          }
          return walletValue;
        });
      } else {
        walletValues.push({
          coin: cObjectIdId,
          balance: amount,
        });
      }

      wallet.walletValues = walletValues;
      return wallet.save();
    }
  }

  async removeCryptoFromWallet(
    userId: string,
    coinId: string,
    amount: number,
  ): Promise<Wallet> {
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    const cId = new Types.ObjectId(coinId);

    const coinWallet = wallet.walletValues.find(
      (walletValue) => walletValue.coin == cId,
    );
    if (!coinWallet) {
      throw new BadRequestException('Coin not found in wallet');
    }

    if (coinWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }
    coinWallet.balance -= amount;

    return await wallet.save();
  }
}

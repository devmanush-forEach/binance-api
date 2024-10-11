// src/transactions/transaction.service.ts

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // Import UUID generator
import { Transaction, TransactionDocument } from './transaction.schema';
import {
  DepositDto,
  SearchTransactionsDto,
  WithdrawalDto,
} from './dto/transaction.dto';
import { Wallet, WalletDocument } from 'src/wallet/wallet.schema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { WalletValue } from 'src/wallet/crypto/crypto.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(createTransactionDto: any): Promise<Transaction> {
    const { transactionId, ...rest } = createTransactionDto;

    const finalTransactionId = transactionId || uuidv4(); // Use provided ID or generate a new one

    const createdTransactionDto = {
      ...rest,
      transactionId: finalTransactionId,
      status: 'pending', // Default status
    };

    const createdTransaction = new this.transactionModel(createdTransactionDto);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel
      .find()
      .populate(['coin', 'user', 'network'])
      .exec();
  }

  async searchTransactions(filters: SearchTransactionsDto): Promise<any> {
    const query: any = {};

    if (filters.user) {
      query.user = filters.user;
    }

    if (filters.coin) {
      query.coin = filters.coin;
    }

    if (filters.transactionType) {
      query.transactionType = filters.transactionType;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.network) {
      query.network = filters.network;
    }

    if (filters.transactionId) {
      query.transactionId = filters.transactionId;
    }

    if (filters.withdrawAddress) {
      query.withdrawAddress = filters.withdrawAddress;
    }

    if (filters.depositAddress) {
      query.depositAddress = filters.depositAddress;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [results, total, statusCounts] = await Promise.all([
      this.transactionModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate(['coin', 'user', 'network'])
        .exec(),
      this.transactionModel.countDocuments(query),
      this.transactionModel.aggregate([
        {
          $match: {
            ...query,
            status: { $in: ['completed', 'failed', 'pending'] },
          },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCountsFormatted = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return {
      transactions: results,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      pending: statusCountsFormatted?.pending || 0,
      completed: statusCountsFormatted?.completed || 0,
      failed: statusCountsFormatted?.failed || 0,
    };
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate(['coin', 'user', 'network'])
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async deposit(userId: string, depositDto: DepositDto) {
    try {
      const { coinId, networkId, amount, transactionId, depositAddress } =
        depositDto;
      const transaction = new this.transactionModel({
        transactionId,
        depositAddress,
        amount,
        user: userId,
        transactionType: 'credit',
        coin: coinId,
        network: networkId,
        status: 'pending',
      });

      await transaction.save();
      this.notificationsGateway.sendDepositRequestNotification(transaction);
      return transaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async withdraw(userId: string, withdrawalDto: WithdrawalDto) {
    try {
      const { coinId, networkId, amount, withdrawAddress } = withdrawalDto;

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

      const transaction = new this.transactionModel({
        amount,
        user: userId,
        transactionType: 'debit',
        coin: coinId,
        network: networkId,
        withdrawAddress,
        status: 'pending',
      });
      coinWallet.balance -= amount;

      await wallet.save();
      await transaction.save();
      this.notificationsGateway.sendWithdrawalRequestNotification(transaction);

      return transaction;
    } catch (error) {
      console.log(error);
    }
  }

  async complete(id: string): Promise<any> {
    try {
      const transaction = await this.transactionModel.findById(id);
      if (!transaction) {
        throw new NotFoundException(`Transaction with ID ${id} not found`);
      }

      const userId = transaction.user;
      const coinId = transaction.coin;
      const transactionAmount = transaction.amount;

      const wallet = await this.walletModel.findOne({
        userId: '66e18fc127b215d986ed4a0a',
      });

      if (transaction.status !== 'pending') {
        throw new NotFoundException(
          `Transaction is already ${transaction.status}`,
        );
      }

      if (transaction.transactionType === 'credit') {
        if (!wallet) {
          const newWallet = new this.walletModel({
            userId,
            walletValues: [],
          });
          const walletValues = newWallet.walletValues || [];
          const cId = new Types.ObjectId(coinId);
          const value: WalletValue = {
            coin: cId,
            balance: transactionAmount,
            address: 'kgjhd ghdfgk jdfshgdfh gdfgh dgh',
          };
          newWallet.walletValues = walletValues;
          newWallet.save();
        } else {
          let walletValues: WalletValue[] = wallet.walletValues;

          const coinWallet = walletValues.find(
            (walletValue) => walletValue.coin === coinId,
          );
          if (coinWallet) {
            walletValues = walletValues.map((walletValue: WalletValue) => {
              if (walletValue.coin === coinId) {
                return {
                  ...walletValue,
                  balance: walletValue.balance + transactionAmount,
                };
              }
              return walletValue;
            });
          } else {
            walletValues.push({
              coin: coinId,
              address: 'dkjfh skldjfh askdfj h',
              balance: transactionAmount,
            });
          }

          wallet.walletValues = walletValues;
          wallet.save();
        }
        transaction.status = 'completed';
        await transaction.save();
      } else if (transaction.transactionType === 'debit') {
        if (!wallet) {
          throw new NotFoundException(
            `Wallet with user ID ${userId} not found`,
          );
        }
        transaction.status = 'completed';
        await transaction.save();
      }
      return transaction;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async fail(id: string): Promise<any> {
    const transaction = await this.transactionModel
      .findByIdAndUpdate(id, { status: 'failed' }, { new: true })
      .exec();

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    const userId = transaction.user;
    const coinId = transaction.coin;
    const transactionAmount = transaction.amount;

    const wallet = await this.walletModel.findOne({ userId });

    if (transaction.transactionType === 'debit') {
      if (!wallet) {
        throw new NotFoundException(`Wallet with user ID ${userId} not found`);
      }

      wallet.walletValues = wallet.walletValues.map(
        (walletValue: WalletValue) => {
          if (walletValue.coin === coinId) {
            return {
              ...walletValue,
              balance: walletValue.balance + transactionAmount,
            };
          }
          return walletValue;
        },
      );
      wallet.save();
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: any): Promise<Transaction> {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .populate(['coin', 'user', 'network'])
      .exec();
    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return updatedTransaction;
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}

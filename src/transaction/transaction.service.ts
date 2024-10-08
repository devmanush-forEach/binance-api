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
import { DepositDto, WithdrawalDto } from './dto/transaction.dto';
import { WalletDocument } from 'src/wallet/wallet.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Transaction.name)
    private walletModel: Model<WalletDocument>,
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
    return this.transactionModel.find().populate('user', 'name').exec(); // Adjust fields to populate as needed
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel
      .findById(id)
      .populate('user', 'name')
      .exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async deposit(userId: string, depositDto: DepositDto) {
    const { coinId, networkId, amount, address, transactionId } = depositDto;

    // let wallet = await this.getWalletByUserId(userId);
    // if (!wallet) {
    //   const newWallet = new this.walletModel({ userId, walletValues: [] });
    //   const walletValues = wallet.walletValues || [];
    //   const cId = new Types.ObjectId(coinId);
    //   const value: WalletValue = {
    //     coin: cId,
    //     balance: amount,
    //     address: 'kgjhd ghdfgk jdfshgdfh gdfgh dgh',
    //   };

    //   newWallet.walletValues = walletValues;
    //   newWallet.save();
    // }

    // Find the coin in the wallet
    // const coinWallet = wallet..find(
    //   (coin) => coin.coin.symbol === coinSymbol,
    // );
    // if (!coinWallet) {
    //   throw new BadRequestException('Coin not found in wallet');
    // }

    // // Save deposit transaction
    const transaction = new this.transactionModel({
      transactionId,
      amount,
      user: userId,
      transactionType: 'credit',
      coin: coinId,
      network: networkId,
      address,
      status: 'pending',
    });
    return transaction.save();

    // // Add the deposited amount to the wallet balance
    // coinWallet.balance += amount;
    // await wallet.save();

    // return transaction;
  }

  async withdraw(userId: string, withdrawalDto: WithdrawalDto) {
    const { coinId, networkId, amount, address } = withdrawalDto;

    const wallet = await this.walletModel.findOne({ userId }).lean().exec();
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
      address,
      status: 'pending',
    });
    return transaction.save();

    // // Subtract the withdrawal amount from the wallet balance
    // coinWallet.balance -= amount;
    // await wallet.save();

    return transaction;
  }

  async update(id: string, updateTransactionDto: any): Promise<Transaction> {
    const updatedTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .populate('user', 'name')
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

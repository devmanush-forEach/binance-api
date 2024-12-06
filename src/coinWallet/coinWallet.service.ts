import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoinWallet, CoinWalletDocument } from './coinWallet.schema';
import { CreateCoinWalletDto, UpdateCoinWalletDto } from './dto/coinWallet.dto';

@Injectable()
export class CoinWalletService {
  constructor(
    @InjectModel(CoinWallet.name)
    private coinWalletModel: Model<CoinWalletDocument>,
  ) {}

  async create(createCoinWalletDto: CreateCoinWalletDto): Promise<CoinWallet> {
    const newCoinWallet = new this.coinWalletModel(createCoinWalletDto);
    return newCoinWallet.save();
  }

  async createMany(
    createCoinWalletsDto: CreateCoinWalletDto[],
  ): Promise<CoinWallet[]> {
    const createdWallets =
      await this.coinWalletModel.insertMany(createCoinWalletsDto);
    return createdWallets.map((wallet) => wallet.toObject() as CoinWallet);
  }

  async findAll(): Promise<CoinWallet[]> {
    return this.coinWalletModel
      .find()
      .populate('coinId')
      .populate('networkId')
      .exec();
  }

  async searchByCoinId(userId: string, coinId: string): Promise<CoinWallet[]> {
    return this.coinWalletModel
      .aggregate([
        {
          $match: {
            coinId,
            $or: [{ isAssigned: false }, { isGlobal: true }, { user: userId }],
          },
        },
        {
          $addFields: {
            priority: { $cond: [{ $ifNull: ['$userId', false] }, 1, 0] },
          },
        },
        {
          $sort: {
            priority: -1,
            _id: 1,
          },
        },
        {
          $group: {
            _id: {
              networkId: '$networkId',
            },
            document: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$document',
          },
        },
        {
          $addFields: {
            coinId: { $toObjectId: '$coinId' },
            networkId: { $toObjectId: '$networkId' },
          },
        },
        {
          $lookup: {
            from: 'coins',
            localField: 'coinId',
            foreignField: '_id',
            as: 'coinId',
          },
        },
        {
          $lookup: {
            from: 'networks',
            localField: 'networkId',
            foreignField: '_id',
            as: 'networkId',
          },
        },
        {
          $unwind: {
            path: '$coinId',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$networkId',
            preserveNullAndEmptyArrays: true, // Optional, keep documents even if no match
          },
        },
      ])
      .exec();
  }

  async searchForUserAssigned({
    coinId,
    userId,
    networkId,
  }: {
    coinId: string;
    networkId: string;
    userId: string;
  }): Promise<CoinWallet[]> {
    return this.coinWalletModel
      .find({ coinId, networkId, user: userId, isActive: true })
      .populate('coinId')
      .populate('networkId')
      .exec();
  }

  async findOne(id: string): Promise<CoinWallet> {
    const coinWallet = await this.coinWalletModel
      .findById(id)
      .populate('coinId')
      .populate('networkId')
      .exec();
    if (!coinWallet) {
      throw new NotFoundException(`CoinWallet with ID ${id} not found`);
    }
    return coinWallet;
  }

  async update(
    id: string,
    updateCoinWalletDto: UpdateCoinWalletDto,
  ): Promise<CoinWallet> {
    return this.coinWalletModel
      .findByIdAndUpdate(id, updateCoinWalletDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.coinWalletModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`CoinWallet with ID ${id} not found`);
    }
  }
}

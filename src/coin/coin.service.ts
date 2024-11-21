import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coin, CoinDocument } from './coin.schema';

@Injectable()
export class CoinService {
  constructor(@InjectModel(Coin.name) private coinModel: Model<CoinDocument>) {}

  async create(createCoinDto: any): Promise<Coin> {
    const createdCoin = new this.coinModel(createCoinDto);
    return createdCoin.save();
  }

  async createMany(createCoinsDto: any[]): Promise<Coin[]> {
    return this.coinModel.insertMany(createCoinsDto, { lean: true });
  }

  async findAll(): Promise<Coin[]> {
    const primary = ['USDT', 'BTC', 'ETH', 'BNB', 'TRX'];

    const coins = await this.coinModel.find().populate(['currency']).exec();

    const sortedCoins = coins.sort((a, b) => {
      const indexA = primary.indexOf(a.symbol);
      const indexB = primary.indexOf(b.symbol);

      // If both are in primary, sort by their order in the primary array
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If one is in primary, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // If neither is in primary, sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

    return sortedCoins;
  }

  async findOne(id: string): Promise<Coin> {
    const coin = await this.coinModel.findById(id).populate('currency').exec();
    if (!coin) {
      throw new NotFoundException(`Coin with ID ${id} not found`);
    }
    return coin;
  }

  async update(id: string, updateCoinDto: any): Promise<Coin> {
    const updatedCoin = await this.coinModel
      .findByIdAndUpdate(id, updateCoinDto, { new: true })
      .populate('currency')
      .exec();
    if (!updatedCoin) {
      throw new NotFoundException(`Coin with ID ${id} not found`);
    }
    return updatedCoin;
  }

  async remove(id: string): Promise<void> {
    const result = await this.coinModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Coin with ID ${id} not found`);
    }
  }
}

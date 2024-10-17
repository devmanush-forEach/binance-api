import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advertisement } from './advertisement.schema';
import {
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
} from './dto/advertisement.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<Advertisement>,
    private walletService: WalletService,
  ) {}

  async create(
    createAdvertisementDto: CreateAdvertisementDto,
  ): Promise<Advertisement> {
    const newAdvertisement = new this.advertisementModel(
      createAdvertisementDto,
    );
    return await newAdvertisement.save();
  }

  async findAll(): Promise<Advertisement[]> {
    return this.advertisementModel
      .find()
      .populate({
        path: 'userId',
        select: 'username email',
      })
      .populate('paymentMethods')
      .populate('currency')
      .populate('coinId')
      .exec();
  }

  async getBuyAdvertisements(): Promise<Advertisement[]> {
    return await this.advertisementModel
      .find({ adType: 'buy' })
      .populate({
        path: 'userId',
        select: 'username email',
      })
      .populate('paymentMethods')
      .populate('currency')
      .populate('coinId')
      .exec();
  }

  async getSellAdvertisements(): Promise<Advertisement[]> {
    return await this.advertisementModel
      .find({ adType: 'sell' })
      .populate({
        path: 'userId',
        select: 'username email',
      })
      .populate('paymentMethods')
      .populate('currency')
      .populate('coinId')
      .exec();
  }

  async searchAdvertisements(
    filters: {
      requestUserId: string;
      userId?: string;
      adType?: string;
      coinId?: string;
      currency?: string;
      priceRange?: number;
      paymentMethods?: string[];
    },
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const queryFilter: any = {};
    const requestUserId = filters.requestUserId;
    if (filters.adType) {
      queryFilter.adType = filters.adType;
    }
    if (filters.coinId && filters.coinId.trim() !== '') {
      queryFilter.coinId = filters.coinId;
    }

    if (filters.currency && filters.currency.trim() !== '') {
      queryFilter.currency = filters.currency;
    }

    if (filters?.priceRange && filters?.priceRange > 0) {
      queryFilter.transactionLimitMin = { $lte: filters?.priceRange };
      queryFilter.transactionLimitMax = { $gte: filters?.priceRange };
    }

    const skip = (page - 1) * limit;

    const query = this.advertisementModel
      .find({ ...queryFilter, isOnline: true, userId: { $ne: requestUserId } })
      .populate([
        'paymentMethods',
        {
          path: 'paymentMethods',
          populate: {
            path: 'transactionMethodId',
            model: 'TransactionMethods',
          },
        },
        'transactionMethods',
        'currency',
        'coinId',
        {
          path: 'userId',
          select: 'username email',
        },
      ])
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const [ads, total] = await Promise.all([
      query,
      this.advertisementModel.countDocuments(queryFilter),
    ]);

    let advertisements = [];

    for (let ad of ads) {
      const userId = ad.userId._id.toString();
      const coinId = ad.coinId._id.toString();
      const walletValue = await this.walletService.getCoinBalanceByUserId(
        userId,
        coinId,
      );
      if (ad.adType === 'sell' && walletValue?.balance < 1) {
      } else {
        advertisements.push({
          ...ad,
          availableCoin: walletValue?.balance || 0,
        });
      }
    }
    const response = {
      advertisements,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };

    return response;
  }
  async findAllAdsForUser(
    filters: {
      requestUserId: string;
      adType?: string;
      coinId?: string;
      status?: 'online' | 'offline';
    },
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    const queryFilter: any = {};
    const requestUserId = filters.requestUserId;
    if (filters.adType) {
      queryFilter.adType = filters.adType;
    }
    if (filters.coinId && filters.coinId.trim() !== '') {
      queryFilter.coinId = filters.coinId;
    }

    // if (filters.currency && filters.currency.trim() !== '') {
    //   queryFilter.currency = filters.currency;
    // }

    // if (filters?.priceRange && filters?.priceRange > 0) {
    //   queryFilter.transactionLimitMin = { $lte: filters?.priceRange };
    //   queryFilter.transactionLimitMax = { $gte: filters?.priceRange };
    // }

    const skip = (page - 1) * limit;

    const query = this.advertisementModel
      .find({ ...queryFilter, userId: { $eq: requestUserId } })
      .populate([
        'paymentMethods',
        {
          path: 'paymentMethods',
          populate: {
            path: 'transactionMethodId',
            model: 'TransactionMethods',
          },
        },
        'transactionMethods',
        'currency',
        'coinId',
        {
          path: 'userId',
          select: 'username email',
        },
      ])
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const [ads, total] = await Promise.all([
      query,
      this.advertisementModel.countDocuments(queryFilter),
    ]);

    let advertisements = [];

    for (let ad of ads) {
      const userId = ad.userId._id.toString();
      const coinId = ad.coinId._id.toString();
      const walletValue = await this.walletService.getCoinBalanceByUserId(
        userId,
        coinId,
      );
      if (ad.adType === 'sell' && walletValue?.balance < 1) {
      } else {
        advertisements.push({
          ...ad,
          availableCoin: walletValue?.balance || 0,
        });
      }
    }
    const response = {
      advertisements,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };

    return response;
  }

  async findAllByUserId(userId: string): Promise<Advertisement[]> {
    return this.advertisementModel
      .find({ userId })
      .populate('paymentMethods')
      .populate('coinId')
      .exec();
  }

  async findOne(id: string): Promise<Advertisement> {
    const advertisement = await this.advertisementModel
      .findById(id)
      .populate('coinId')
      .exec();
    if (!advertisement) {
      throw new NotFoundException('Advertisement not found');
    }
    return advertisement;
  }

  async update(
    id: string,
    updateAdvertisementDto: UpdateAdvertisementDto,
  ): Promise<Advertisement> {
    const updatedAdvertisement = await this.advertisementModel
      .findByIdAndUpdate(id, updateAdvertisementDto, { new: true })
      .populate('paymentMethod')
      .populate('currency')
      .populate('coinId')
      .exec();

    if (!updatedAdvertisement) {
      throw new NotFoundException('Advertisement not found');
    }
    return updatedAdvertisement;
  }

  async remove(id: string): Promise<void> {
    const result = await this.advertisementModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Advertisement not found');
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advertisement } from './advertisement.schema';
import {
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
} from './dto/advertisement.dto';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectModel(Advertisement.name)
    private advertisementModel: Model<Advertisement>,
  ) { }

  async create(
    createAdvertisementDto: CreateAdvertisementDto,
  ): Promise<Advertisement> {
    const newAdvertisement = new this.advertisementModel(
      createAdvertisementDto,
    );
    return await newAdvertisement.save();
  }

  async findAll(): Promise<Advertisement[]> {
    return this.advertisementModel.find().populate({
      path: 'userId',
      select: 'username email',
    }).populate('paymentMethods').populate('currency').populate('coinId').exec();
  }

  async getBuyAdvertisements(): Promise<Advertisement[]> {
    return await this.advertisementModel.find({ adType: 'buy' }).populate({
      path: 'userId',
      select: 'username email',
    }).populate('paymentMethods').populate('currency').populate('coinId').exec();;
  }

  async getSellAdvertisements(): Promise<Advertisement[]> {
    return await this.advertisementModel.find({ adType: 'sell' }).populate({
      path: 'userId',
      select: 'username email',
    }).populate('paymentMethods').populate('currency').populate('coinId').exec();;
  }

  async searchAdvertisements(
    filters: {
      userId?: string;
      adType?: string;
      coinId?: string;
    },
    page: number = 1,
    limit: number = 10
  ): Promise<Advertisement[]> {
    const queryFilter: any = {};

    if (filters.userId) {
      queryFilter.userId = filters.userId;
    }
    if (filters.adType) {
      queryFilter.adType = filters.adType;
    }
    if (filters.coinId && filters.coinId.trim() !== '') {
      queryFilter.coinId = filters.coinId;
    }

    const skip = (page - 1) * limit;

    return await this.advertisementModel
      .find(queryFilter)
      .populate({
        path: 'userId',
        select: 'username email',
      })
      .populate('paymentMethods')
      .populate('currency')
      .populate('coinId')
      .skip(skip)
      .limit(limit)
      .exec();
  }


  async findAllByUserId(userId: string): Promise<Advertisement[]> {
    return this.advertisementModel.find({ userId }).populate('paymentMethods').populate('coinId').exec();
  }

  async findOne(id: string): Promise<Advertisement> {
    const advertisement = await this.advertisementModel
      .findById(id)
      .populate('paymentMethod')
      .populate('currency')
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

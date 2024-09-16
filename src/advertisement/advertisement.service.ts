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
    return this.advertisementModel.find().populate('paymentMethod').exec();
  }

  async findOne(id: string): Promise<Advertisement> {
    const advertisement = await this.advertisementModel
      .findById(id)
      .populate('paymentMethod')
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

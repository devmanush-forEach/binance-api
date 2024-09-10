import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Buyer, BuyerDocument } from './buyer.schema';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(Buyer.name) private buyerModel: Model<BuyerDocument>,
  ) {}

  async create(createBuyerDto: any): Promise<Buyer> {
    const createdBuyer = new this.buyerModel(createBuyerDto);
    return createdBuyer.save();
  }

  async findAll(): Promise<Buyer[]> {
    return this.buyerModel.find().exec();
  }

  async findOne(id: string): Promise<Buyer> {
    const buyer = await this.buyerModel.findById(id).exec();
    if (!buyer) {
      throw new NotFoundException(`Buyer with ID ${id} not found`);
    }
    return buyer;
  }

  async update(id: string, updateBuyerDto: any): Promise<Buyer> {
    const updatedBuyer = await this.buyerModel
      .findByIdAndUpdate(id, updateBuyerDto, { new: true })
      .exec();
    if (!updatedBuyer) {
      throw new NotFoundException(`Buyer with ID ${id} not found`);
    }
    return updatedBuyer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.buyerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Buyer with ID ${id} not found`);
    }
  }
}

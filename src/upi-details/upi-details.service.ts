import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPIDetails, UPIDetailsDocument } from './upi-details.schema';

@Injectable()
export class UPIDetailsService {
  constructor(
    @InjectModel(UPIDetails.name)
    private upiDetailsModel: Model<UPIDetailsDocument>,
  ) {}

  async create(createUPIDetailsDto: any): Promise<UPIDetails> {
    const createdUPIDetails = new this.upiDetailsModel(createUPIDetailsDto);
    return createdUPIDetails.save();
  }

  async findAll(): Promise<UPIDetails[]> {
    return this.upiDetailsModel.find().populate('user').exec();
  }

  async findAllByUserId(userId: string): Promise<any> {
    const result = {};

    const query = [
      { $match: { userId, transactionMethodId: { $ne: null } } },
      {
        $group: {
          _id: '$transactionMethodId',
          upis: { $push: '$$ROOT' },
        },
      },
    ];

    const upiMethods = await this.upiDetailsModel.aggregate(query);

    upiMethods?.forEach((method) => {
      result[method._id] = method.upis;
    });

    return result;
  }

  async findOne(id: string): Promise<UPIDetails> {
    const upiDetails = await this.upiDetailsModel
      .findById(id)
      .populate('user')
      .exec();
    if (!upiDetails) {
      throw new NotFoundException(`UPI details with ID ${id} not found`);
    }
    return upiDetails;
  }

  async update(id: string, updateUPIDetailsDto: any): Promise<UPIDetails> {
    const updatedUPIDetails = await this.upiDetailsModel
      .findByIdAndUpdate(id, updateUPIDetailsDto, { new: true })
      .populate('user')
      .exec();
    if (!updatedUPIDetails) {
      throw new NotFoundException(`UPI details with ID ${id} not found`);
    }
    return updatedUPIDetails;
  }

  async remove(id: string): Promise<void> {
    const result = await this.upiDetailsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`UPI details with ID ${id} not found`);
    }
  }
}

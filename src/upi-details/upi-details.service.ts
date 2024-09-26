import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UPIDetails, UPIDetailsDocument } from './upi-details.schema';

@Injectable()
export class UPIDetailsService {
  constructor(
    @InjectModel(UPIDetails.name)
    private upiDetailsModel: Model<UPIDetailsDocument>,
  ) { }

  async create(createUPIDetailsDto: any): Promise<UPIDetails> {
    console.log(createUPIDetailsDto);
    const createdUPIDetails = new this.upiDetailsModel(createUPIDetailsDto);
    return createdUPIDetails.save();
  }

  async findAll(): Promise<UPIDetails[]> {
    return this.upiDetailsModel.find().populate('user').exec();
  }
  async findAllByUserId(userId: string): Promise<UPIDetails[]> {
    return this.upiDetailsModel.find({ userId }).populate('user').exec();
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

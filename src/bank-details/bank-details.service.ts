import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BankDetails, BankDetailsDocument } from './bank-details.schema';

@Injectable()
export class BankDetailsService {
  constructor(
    @InjectModel(BankDetails.name)
    private bankDetailsModel: Model<BankDetailsDocument>,
  ) { }

  async create(createBankDetailsDto: any): Promise<BankDetails> {
    const createdBankDetails = new this.bankDetailsModel(createBankDetailsDto);
    return createdBankDetails.save();
  }

  async findAll(): Promise<BankDetails[]> {
    return this.bankDetailsModel.find().exec();
  }

  async findAllByUserId(
    userId: string,
  ): Promise<any> {
    const result = {};
    const bankDetails = await this.bankDetailsModel.aggregate([
      { $match: { userId, transactionMethodId: { $ne: null } } },
      {
        $group: {
          _id: '$transactionMethodId',
          upis: { $push: '$$ROOT' },
        },
      },
    ]);

    bankDetails?.forEach((method) => {
      result[method._id] = method.upis;
    })
    return result;
  }

  async findOne(id: string): Promise<BankDetails> {
    const bankDetails = await this.bankDetailsModel.findById(id).exec();
    if (!bankDetails) {
      throw new NotFoundException(`Bank details with ID ${id} not found`);
    }
    return bankDetails;
  }

  async update(id: string, updateBankDetailsDto: any): Promise<BankDetails> {
    const updatedBankDetails = await this.bankDetailsModel
      .findByIdAndUpdate(id, updateBankDetailsDto, { new: true })
      .exec();
    if (!updatedBankDetails) {
      throw new NotFoundException(`Bank details with ID ${id} not found`);
    }
    return updatedBankDetails;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bankDetailsModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Bank details with ID ${id} not found`);
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TransactionMethods,
  TransactionMethodsDocument,
} from './transaction-methods.schema';

@Injectable()
export class TransactionMethodsService {
  constructor(
    @InjectModel(TransactionMethods.name)
    private transactionMethodsModel: Model<TransactionMethodsDocument>,
  ) {}

  async create(
    createTransactionMethodDto: TransactionMethods,
  ): Promise<TransactionMethods> {
    const createdMethod = new this.transactionMethodsModel(
      createTransactionMethodDto,
    );
    return createdMethod.save();
  }

  async findAll(): Promise<TransactionMethods[]> {
    return this.transactionMethodsModel.find().lean().exec();
  }

  async findOne(id: string): Promise<TransactionMethods> {
    const method = await this.transactionMethodsModel.findById(id).exec();
    if (!method) {
      throw new NotFoundException(
        `Transaction method with ID "${id}" not found`,
      );
    }
    return method;
  }

  async update(
    id: string,
    updateData: Partial<TransactionMethods>,
  ): Promise<TransactionMethods> {
    const updatedMethod = await this.transactionMethodsModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedMethod) {
      throw new NotFoundException(
        `Transaction method with ID "${id}" not found`,
      );
    }
    return updatedMethod;
  }

  async remove(id: string): Promise<void> {
    const result = await this.transactionMethodsModel
      .findByIdAndDelete(id)
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Transaction method with ID "${id}" not found`,
      );
    }
  }
}

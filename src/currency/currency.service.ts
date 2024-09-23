import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './currency.schema';
import { CreateCurrencyDto, UpdateCurrencyDto } from './currency.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency.name) private currencyModel: Model<CurrencyDocument>,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const newCurrency = new this.currencyModel(createCurrencyDto);
    return newCurrency.save();
  }

  async findAll(): Promise<Currency[]> {
    return this.currencyModel.find().exec();
  }

  async findOne(id: string): Promise<Currency> {
    const currency = await this.currencyModel.findById(id).exec();
    if (!currency) {
      throw new NotFoundException(`Currency with id ${id} not found`);
    }
    return currency;
  }

  async update(
    id: string,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    const updatedCurrency = await this.currencyModel
      .findByIdAndUpdate(id, updateCurrencyDto, { new: true })
      .exec();
    if (!updatedCurrency) {
      throw new NotFoundException(`Currency with id ${id} not found`);
    }
    return updatedCurrency;
  }

  async delete(id: string): Promise<void> {
    const result = await this.currencyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Currency with id ${id} not found`);
    }
  }
}

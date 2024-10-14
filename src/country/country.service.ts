import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country } from './country.schema';
import { CreateCountryDto, UpdateCountryDto } from './dto/country.dto';

@Injectable()
export class CountryService {
  constructor(
    @InjectModel(Country.name) private countryModel: Model<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = new this.countryModel(createCountryDto);
    return country.save();
  }

  async findAll(): Promise<Country[]> {
    return this.countryModel.find().populate('currency').exec();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryModel
      .findById(id)
      .populate('currency')
      .exec();
    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const updatedCountry = await this.countryModel
      .findByIdAndUpdate(id, updateCountryDto, { new: true })
      .exec();
    if (!updatedCountry) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
    return updatedCountry;
  }

  async remove(id: string): Promise<void> {
    const result = await this.countryModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }
  }
}

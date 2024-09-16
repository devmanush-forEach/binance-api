import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upi, UpiDocument } from './upi.schema';

@Injectable()
export class UpiService {
    constructor(@InjectModel(Upi.name) private readonly upiModel: Model<UpiDocument>) { }

    async create(createUpiDto: any): Promise<Upi> {
        const createdUpi = new this.upiModel(createUpiDto);
        return createdUpi.save();
    }

    async findAll(): Promise<Upi[]> {
        return this.upiModel.find().exec();
    }

    async findOne(id: string): Promise<Upi> {
        return this.upiModel.findById(id).exec();
    }

    async update(id: string, updateUpiDto: any): Promise<Upi> {
        return this.upiModel.findByIdAndUpdate(id, updateUpiDto, { new: true }).exec();
    }

    async delete(id: string): Promise<any> {
        return this.upiModel.findByIdAndDelete(id).exec();
    }
}

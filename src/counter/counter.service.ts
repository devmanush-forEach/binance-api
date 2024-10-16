// counter.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Counter, CounterDocument } from './counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
  ) {}

  // Method to get the next order number
  async getNextOrderNo(): Promise<number> {
    try {
      const defaultOrderNo = 1100045556;
      const counter = await this.counterModel.findOneAndUpdate(
        { _id: 'order' },
        [
          {
            $set: {
              orderNo: {
                $cond: [
                  { $ifNull: ['$orderNo', false] },
                  { $add: ['$orderNo', 1] },
                  defaultOrderNo,
                ],
              },
            },
          },
        ],
        {
          new: true,
          upsert: true,
        },
      );

      if (!counter.orderNo) {
        counter.orderNo = defaultOrderNo;
        await counter.save();
      }

      return counter.orderNo;
    } catch (error) {
      console.error('Error fetching next order number:', JSON.stringify(error));
      throw new Error('Failed to get the next order number.');
    }
  }

  // Similarly, update other methods if needed
  async getNextUserNo(): Promise<number> {
    const defaultUserNo = 11000004200;
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'user' },
      {
        $inc: { userNo: 1 },
        $setOnInsert: { userNo: defaultUserNo },
      },
      { new: true, upsert: true },
    );
    return counter.userNo;
  }

  async getNextAdNo(): Promise<number> {
    const defaultAdNo = 11000003400;
    const counter = await this.counterModel.findOneAndUpdate(
      { _id: 'ad' },
      {
        $inc: { adNo: 1 },
        $setOnInsert: { adNo: defaultAdNo },
      },
      { new: true, upsert: true },
    );
    return counter.adNo;
  }
}

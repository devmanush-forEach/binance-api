// src/order/order.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { OrderFilterDTO, OrderResponse } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('ad').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate([
        {
          path: 'ad',
          populate: [
            {
              path: 'coinId',
              model: 'Coin',
            },
            {
              path: 'currency',
              model: 'Currency',
            },
            {
              path: 'userId',
              model: 'User',
            },
          ],
        },
        'user',
        'transactionMethod',
        'paymentService',
      ])
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
  async findAllForUser(
    userId: string,
    filters: OrderFilterDTO,
  ): Promise<OrderResponse> {
    const {
      page = 1,
      type,
      status,
      coinId,
      currencyId,
      dateRange,
      orderNo,
    } = filters;

    const limit = 10;
    const skip = (page - 1) * limit;

    const filterConditions: any = { user: userId };

    if (type) {
      filterConditions.type = type;
    }

    if (status) {
      filterConditions.status = status;
    }

    if (orderNo) {
      filterConditions.orderNo = orderNo;
    }

    if (coinId) {
      filterConditions['ad.coinId'] = coinId;
    }

    if (currencyId) {
      filterConditions['ad.currency'] = currencyId;
    }

    if (dateRange) {
      filterConditions.createdAt = {
        $gte: dateRange.fromDate,
        $lte: dateRange.toDate,
      };
    }

    const total = await this.orderModel.countDocuments(filterConditions);

    const totalPages = Math.ceil(total / limit);

    const orders = await this.orderModel
      .find(filterConditions)
      .populate({
        path: 'ad',
        populate: [
          {
            path: 'coinId',
            model: 'Coin',
          },
          {
            path: 'currency',
            model: 'Currency',
          },
          {
            path: 'userId',
            model: 'User',
          },
        ],
      })
      .limit(limit)
      .skip(skip)
      .exec();

    // Return the paginated response object
    return {
      orders,
      currentPage: page,
      totalPages,
      total,
    };
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('ad')
      .exec();
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}

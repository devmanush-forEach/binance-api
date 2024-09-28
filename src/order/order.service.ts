// src/order/order.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) { }

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
      .populate('ad')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
  async findAllForUser(userId: string, filters: { page?: number; type?: string; status?: string }): Promise<Order[]> {
    const { page = 1, type, status } = filters;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filterConditions: any = { user: userId };

    if (type) {
      filterConditions.type = type;
    }

    if (status) {
      filterConditions.status = status;
    }

    return this.orderModel
      .find(filterConditions)
      .populate({
        path: 'ad',
        populate: [{
          path: 'coinId',
          model: 'Coin'
        }, {
          path: 'currency',
          model: 'Currency'
        }, {
          path: 'userId',
          model: 'User'
        }]
      })
      .limit(limit)
      .skip(skip)
      .exec();
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

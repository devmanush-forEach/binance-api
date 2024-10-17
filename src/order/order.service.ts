// src/order/order.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import {
  CancelOrderDto,
  CreateOrderDto,
  OrderFilterDTO,
  OrderResponse,
} from './dto/order.dto';
import { CounterService } from 'src/counter/counter.service';
import { AdvertisementService } from 'src/advertisement/advertisement.service';
import {
  convertToProvidedCurrency,
  getPercentValue,
} from 'src/helpers/calculate.helpers';
import { Coin } from 'src/coin/coin.schema';
import { CoinService } from 'src/coin/coin.service';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly counterService: CounterService,
    private readonly advertisementService: AdvertisementService,
    private readonly coinService: CoinService,
    private readonly currencyService: CurrencyService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderNo = await this.counterService.getNextOrderNo();
    if (!orderNo) throw new Error('No Order No. present');
    const ad = await this.advertisementService.findOne(createOrderDto.ad);
    const coin: any = ad.coinId;
    let coinRate: number = ad.transactionPrice;
    if (ad.isDynamicPrice) {
      const percentValue = getPercentValue(coin.price, ad.pricePercent);
      const fromCurrency = await this.currencyService.findOne(coin.currency);
      const toCurrency = await this.currencyService.findOne(
        createOrderDto.currency,
      );
      coinRate = convertToProvidedCurrency(
        percentValue,
        fromCurrency,
        toCurrency,
      );
    }
    try {
      const createdOrder = new this.orderModel({
        ...createOrderDto,
        orderNo,
        coinPrice: coinRate,
      });
      return createdOrder.save();
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('ad').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate([
        {
          path: 'paymentService',
          populate: [
            {
              path: 'transactionMethodId',
              model: 'TransactionMethods',
            },
          ],
        },
        'user',
        'ad',
        'coin',
        'advertiser',
        'currency',
      ])
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }
  async findAllByUser(
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
      filterConditions.coin = coinId;
    }

    if (currencyId) {
      filterConditions.currency = currencyId;
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

    const filterConditions: any = { advertiser: userId };

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

    return {
      orders,
      currentPage: page,
      totalPages,
      total,
    };
  }

  async cancelOrder(
    orderId: string,
    cancelOrderDto: CancelOrderDto,
  ): Promise<Order> {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Update the order status to canceled and store cancellation details
    order.status = 'canceled';
    order.cancellationDetails = {
      cancelledBy: cancelOrderDto.cancelledBy,
      reason: cancelOrderDto.reason,
      refundStatus: cancelOrderDto.refundStatus || 'not_refunded',
      cancelledAt: new Date(),
    };

    return order.save();
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

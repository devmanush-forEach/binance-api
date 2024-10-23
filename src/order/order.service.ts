// src/order/order.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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
import { ChatService } from 'src/chat/chat.service';
import { NotificationService } from 'src/notification/notification.service';
import { title } from 'process';
import { WalletService } from 'src/wallet/wallet.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly counterService: CounterService,
    private readonly advertisementService: AdvertisementService,
    private readonly coinService: CoinService,
    private readonly currencyService: CurrencyService,
    private readonly chatService: ChatService,
    private readonly notificationService: NotificationService,
    private readonly walletService: WalletService,
    private readonly chatGateway: ChatGateway,
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

      if (ad.autoReplyMessage && ad.autoReplyMessage.trim() !== '') {
        let messageData = {
          sender: createOrderDto.advertiser,
          recipient: createOrderDto.user,
          orderId: createdOrder._id.toString(),
          content: ad.autoReplyMessage,
          fileUrl: undefined,
        };
        const message = await this.chatService.createMessage(messageData);
      }

      if (createdOrder.type === 'sell') {
        const walletValue = await this.walletService.getCoinBalanceByUserId(
          createOrderDto.user,
          coin._id.toString(),
        );
        if (!walletValue) throw new Error(`Don't have enough coin wallet.`);
        if (walletValue.balance < createOrderDto.amount) {
          throw new Error(`Don't have enough coin wallet.`);
        }
        const updated = await this.walletService.removeCryptoFromWallet(
          createOrderDto.user,
          coin._id.toString(),
          createOrderDto.amount,
        );
        if (!updated)
          throw new Error('Advertiser not have enough coin in wallet');
      } else if (createdOrder.type === 'buy') {
        const walletValue = await this.walletService.getCoinBalanceByUserId(
          createOrderDto.advertiser,
          coin._id.toString(),
        );
        if (!walletValue)
          throw new Error('Advertiser not have enough coin in wallet');

        if (walletValue.balance < createOrderDto.amount) {
          throw new Error('Advertiser not have enough coin in wallet');
        }
        const updated = await this.walletService.removeCryptoFromWallet(
          createOrderDto.advertiser,
          coin._id.toString(),
          createOrderDto.amount,
        );
        if (!updated)
          throw new Error('Advertiser not have enough coin in wallet');
      }

      const order = await createdOrder.save();
      if (order) {
        this.notificationService.sendNotificationByUserId(
          createOrderDto.advertiser,
          { title: 'New Order Created' },
        );
      }
      return order;
    } catch (error) {
      console.log(JSON.stringify(error));
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel
      .find()
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
    const order = await this.orderModel
      .findById(orderId)
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
      throw new NotFoundException('Order not found');
    }

    let walletUser: string;
    if (order.type == 'sell') {
      walletUser = order.user._id.toString();
    } else if (order.type == 'buy') {
      walletUser = order.advertiser._id.toString();
    }

    const wallet = this.walletService.addCryptoToUserWallet(
      walletUser,
      order.coin._id.toString(),
      order.amount,
    );
    if (!wallet) throw new Error('Something went wrong');

    order.status = 'canceled';
    order.cancellationDetails = {
      cancelledBy: cancelOrderDto.cancelledBy,
      reason: cancelOrderDto.reason,
      refundStatus: cancelOrderDto.refundStatus || 'not_refunded',
      cancelledAt: new Date(),
    };

    return order.save();
  }

  async releaseCrypto(orderId: string, userId: string): Promise<Order> {
    const orderDetails = await this.orderModel
      .findById(orderId)
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
    if (!orderDetails) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const isAdvertiser = orderDetails.advertiser._id.toString() === userId;

    if (
      (isAdvertiser && orderDetails.type == 'sell') ||
      (!isAdvertiser && orderDetails.type === 'buy')
    ) {
      throw new NotFoundException(`Not Authorised`);
    }

    let buyerId: string;

    if (isAdvertiser && orderDetails.type == 'buy') {
      buyerId = orderDetails.user._id.toString();
    } else if (!isAdvertiser && orderDetails.type === 'sell') {
      buyerId = orderDetails.advertiser._id.toString();
    }

    const wallet = await this.walletService.addCryptoToUserWallet(
      buyerId,
      orderDetails.coin._id.toString(),
      orderDetails.amount,
    );

    if (!wallet) {
      throw new NotFoundException(`Something went wrong!`);
    }

    orderDetails.status = 'completed';
    const order = orderDetails.save();

    this.notificationService.sendNotificationByUserId(buyerId, {
      title: `OrderNo ${orderDetails.orderNo} Successfully completed`,
    });

    this.chatGateway.orderUpdated(buyerId, orderDetails.orderNo);
    return order;
  }
  async update(id: string, updateOrderDto: any): Promise<Order> {
    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
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

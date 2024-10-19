import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderNotification } from './orderNotification.schema';
import { CreateOrderNotificationDto } from './dto/orderNotification.dto';
import { OrderService } from '../order.service';

@Injectable()
export class OrderNotificationService {
  constructor(
    @InjectModel(OrderNotification.name)
    private readonly orderNotificationModel: Model<OrderNotification>,
    private readonly orderService: OrderService,
  ) {}

  async createNotification(
    createOrderNotificationDto: CreateOrderNotificationDto,
  ): Promise<OrderNotification> {
    const orderDetails = await this.orderService.findOne(
      createOrderNotificationDto.orderId,
    );

    console.log(orderDetails, createOrderNotificationDto);
    let reciever: string;
    if (
      orderDetails.advertiser._id.toString() ===
      createOrderNotificationDto?.sender.toString()
    ) {
      reciever = orderDetails.user._id.toString();
    } else if (
      orderDetails.user._id.toString() ===
      createOrderNotificationDto?.sender.toString()
    ) {
      reciever = orderDetails.advertiser._id.toString();
    }

    console.log(reciever);
    if (!reciever) {
      throw new Error('No Reciever found');
    }

    const message = ``;

    const notification = new this.orderNotificationModel({
      ...createOrderNotificationDto,
      reciever,
    });
    return notification.save();
  }
}

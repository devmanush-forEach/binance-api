import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderNotification } from './orderNotification.schema';
import { CreateOrderNotificationDto } from './dto/orderNotification.dto';
import { OrderService } from '../order.service';
import { NotificationService } from 'src/notification/notification.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class OrderNotificationService {
  constructor(
    @InjectModel(OrderNotification.name)
    private readonly orderNotificationModel: Model<OrderNotification>,
    private readonly orderService: OrderService,
    private readonly chatGateway: ChatGateway,
    private readonly notificationService: NotificationService,
  ) {}

  async transaferredNotification(
    createOrderNotificationDto: CreateOrderNotificationDto,
  ): Promise<OrderNotification> {
    const orderDetails = await this.orderService.findOne(
      createOrderNotificationDto.orderId,
    );

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
    const message = `Trnsaction is completed for order no. ${orderDetails.orderNo}`;

    console.log(reciever);
    if (!reciever) {
      throw new Error('No Reciever found');
    }

    const notification = new this.orderNotificationModel({
      ...createOrderNotificationDto,
      message,
      reciever,
    });

    this.notificationService.sendNotificationByUserId(
      notification.reciever.toString(),
      {
        title: 'Order Notification',
        body: message,
      },
    );

    const order = await this.orderService.update(
      createOrderNotificationDto.orderId,
      {
        status: 'paid',
      },
    );
    this.chatGateway.orderUpdated(
      notification.reciever.toString(),
      order.orderNo,
    );

    return notification.save();
  }
}

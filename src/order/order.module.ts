// src/order/order.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import {
  OrderNotification,
  OrderNotificationSchema,
} from './orderNotification/orderNotification.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CounterModule } from 'src/counter/counter.module';
import { AdvertisementModule } from 'src/advertisement/advertisement.module';
import { CoinModule } from 'src/coin/coin.module';
import { CurrencyModule } from 'src/currency/currency.module';
import { ChatModule } from 'src/chat/chat.module';
import { OrderNotificationService } from './orderNotification/orderNotification.service';
import { AwsModule } from 'src/aws/aws.module';
import { NotificationModule } from 'src/notification/notification.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    NotificationModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderNotification.name, schema: OrderNotificationSchema }, // Import the OrderNotification schema
    ]),
    CounterModule,
    AdvertisementModule,
    CoinModule,
    CurrencyModule,
    ChatModule,
    AwsModule,
    WalletModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderNotificationService],
})
export class OrderModule {}

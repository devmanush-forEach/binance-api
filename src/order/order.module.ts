// src/order/order.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CounterModule } from 'src/counter/counter.module';
import { AdvertisementModule } from 'src/advertisement/advertisement.module';
import { CoinModule } from 'src/coin/coin.module';
import { CurrencyModule } from 'src/currency/currency.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CounterModule,
    AdvertisementModule,
    CoinModule,
    CurrencyModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

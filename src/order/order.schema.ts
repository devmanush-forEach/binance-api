// src/order/schemas/order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Advertisement } from 'src/advertisement/advertisement.schema';
import { Coin } from 'src/coin/coin.schema';
import { Currency } from 'src/currency/currency.schema';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
import { PaymentServices } from 'src/user/payment-services/payment-services.schema';
import { User } from 'src/user/user.schema';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Order {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  orderNo: number;

  @Prop({ required: false })
  cancelReason: string;

  @Prop({ required: true, enum: ['buy', 'sell'] })
  type: string;

  @Prop({
    required: true,
    enum: [
      'pending',
      'processing',
      'paid',
      'successful',
      'completed',
      'canceled',
    ],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Advertisement.name, required: true })
  ad: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  advertiser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Coin.name, required: true })
  coin: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Currency.name, required: true })
  currency: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TransactionMethods.name, required: false })
  transactionMethod: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PaymentServices.name, required: false })
  paymentService: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

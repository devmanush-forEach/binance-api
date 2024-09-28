// src/order/schemas/order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Advertisement } from 'src/advertisement/advertisement.schema';
import { Currency } from 'src/currency/currency.schema';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
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

  @Prop({ required: true, enum: ['buy', 'sell'] })
  type: string;

  @Prop({
    required: true,
    enum: ['pending', 'processing', 'completed', 'canceled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Advertisement.name, required: true })
  ad: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: TransactionMethods.name, required: true })
  transactionMethod: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// src/order/schemas/order.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Buyer } from 'src/user/buyer/buyer.schema';
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
    enum: ['pending', 'completed', 'canceled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Buyer.name, required: true })
  buyer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

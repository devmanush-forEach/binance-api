// src/order/schemas/order.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Advertisement } from 'src/advertisement/advertisement.schema';
import { Coin } from 'src/coin/coin.schema';
import { Currency } from 'src/currency/currency.schema';
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

  @Prop({ required: true, unique: true })
  orderNo: number;

  @Prop({
    type: {
      cancelledBy: { type: String, enum: ['buyer', 'seller', 'system'] },
      reason: { type: String },
      refundStatus: {
        type: String,
        enum: ['not_refunded', 'refunded'],
        default: 'not_refunded',
      },
      cancelledAt: { type: Date },
    },
    required: false,
  })
  cancellationDetails: {
    cancelledBy: string;
    reason: string;
    refundStatus: string;
    cancelledAt: Date;
  };

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

  @Prop({ type: Number, required: true })
  atPrice: number;

  @Prop({ type: Types.ObjectId, ref: Currency.name, required: true })
  currency: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: PaymentServices.name, required: false })
  paymentService: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

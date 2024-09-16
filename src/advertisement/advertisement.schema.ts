import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Coin } from 'src/coin/coin.schema';

export enum AdType {
  BUY = 'buy',
  SELL = 'sell',
}

@Schema({ timestamps: true })
export class Advertisement extends Document {
  @Prop({ enum: AdType, required: true })
  adType: AdType;

  @Prop({ type: String, required: true })
  priceType: string;

  @Prop({ type: Number, required: true })
  transactionPrice: number;

  @Prop({ type: Number, required: true })
  marketPrice: number;

  @Prop({ type: Number, required: true })
  minAmount: number;

  @Prop({ type: Number, required: true })
  maxAmount: number;

  @Prop({ type: String, required: true })
  transactionTitle: string;

  @Prop({ type: String })
  transactionRemark: string;

  @Prop({ type: Types.ObjectId, ref: Coin.name, required: true })
  paymentMethod: Types.ObjectId;

  @Prop({ type: Number, required: true })
  transactionFee: number;
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);

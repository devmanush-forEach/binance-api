import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BuyerDocument = Buyer & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Buyer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  coinValue: number;

  @Prop({ required: true })
  priceLimit: number;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], default: [] })
  paymentMethods: string[];
}

export const BuyerSchema = SchemaFactory.createForClass(Buyer);

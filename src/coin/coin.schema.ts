import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Currency } from 'src/currency/currency.schema';

export type CoinDocument = Coin & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Coin {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  marketCap: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: Currency.name, required: true })
  currency: Types.ObjectId;

  @Prop({ default: 0 })
  volume: number;

  @Prop({ required: true })
  circulatingSupply: number;

  @Prop({ required: true })
  totalSupply: number;

  @Prop({ required: true })
  iconUrl: string;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);

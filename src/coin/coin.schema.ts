import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

  @Prop({ default: 0 })
  volume: number;

  @Prop({ required: true })
  circulatingSupply: number;

  @Prop({ required: true })
  totalSupply: number;
}

export const CoinSchema = SchemaFactory.createForClass(Coin);

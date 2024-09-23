import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CurrencyDocument = Currency & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Currency {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ required: true })
  valueInUSD: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);

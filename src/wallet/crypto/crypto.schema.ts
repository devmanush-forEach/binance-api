import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CryptoDocument = Crypto & Document;

@Schema()
export class Crypto {
  @Prop({ type: Types.ObjectId, ref: 'Coin', required: true })
  coin: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true })
  address: string;
}

export const CryptoSchema = SchemaFactory.createForClass(Crypto);

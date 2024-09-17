import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Coin } from 'src/coin/coin.schema';

export type WalletValueDocument = WalletValue & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class WalletValue {
  @Prop({ type: Types.ObjectId, ref: Coin.name, required: true })
  coin: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true })
  address: string;
}

export const WalletValueSchema = SchemaFactory.createForClass(WalletValue);

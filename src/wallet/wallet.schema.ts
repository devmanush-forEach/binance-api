import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Crypto, CryptoSchema } from './crypto/crypto.schema';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [CryptoSchema], default: [] })
  cryptocurrencies: Crypto[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
